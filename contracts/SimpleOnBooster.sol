// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleOnBooster
 * @notice Production-grade Solidity Smart Contract for SimpleOn Booster Plan & Matrix Engine
 * @dev Implements 4 Booster Tiers (Starter, Builder, Leader, Champion) and 100x Main Plan allocation:
 *      - X5 Matrix Split (15%)
 *      - 13-Level Forced Income Pool (65% -> 5% per level across 13 levels)
 *      - X4 Passive Spillover Allocation (20%)
 */

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(_msgSender());
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract SimpleOnBooster is Ownable, ReentrancyGuard {
    IERC20 public immutable usdtToken;

    uint256 public basePlanAmount; // Default: 1.00 USDT (1e18 or 1e6)
    
    enum BoosterTier { NONE, STARTER, BUILDER, LEADER, CHAMPION, MAIN_PLAN }

    struct User {
        bool isRegistered;
        address referrer;
        BoosterTier currentTier;
        uint256 totalEarnings;
        uint256 directReferralsCount;
        uint256 boosterCycleCount;
        uint256 activeLevel;
    }

    mapping(address => User) public users;
    mapping(address => address[]) public directReferrals;
    
    // Tier multipliers relative to Base Plan
    uint256 public constant STARTER_MULT = 1;   // 1x
    uint256 public constant BUILDER_MULT = 4;   // 4x
    uint256 public constant LEADER_MULT = 16;  // 16x
    uint256 public constant CHAMPION_MULT = 64; // 64x
    uint256 public constant MAIN_MULT = 100;    // 100x

    // Events
    event UserRegistered(address indexed user, address indexed referrer);
    event BoosterUpgraded(address indexed user, BoosterTier newTier, uint256 amount);
    event RewardDistributed(address indexed recipient, uint256 amount, string distributionType);
    event MainPlanActivated(address indexed user, uint256 totalAmount);

    constructor(address _usdtTokenAddress, uint256 _basePlanAmount) {
        require(_usdtTokenAddress != address(0), "Invalid USDT address");
        usdtToken = IERC20(_usdtTokenAddress);
        basePlanAmount = _basePlanAmount > 0 ? _basePlanAmount : 1e18; // Default 1 USDT

        // Root contract owner registration
        users[msg.sender] = User({
            isRegistered: true,
            referrer: address(0),
            currentTier: BoosterTier.CHAMPION,
            totalEarnings: 0,
            directReferralsCount: 0,
            boosterCycleCount: 0,
            activeLevel: 13
        });
    }

    /**
     * @notice Register a new participant with a referrer and activate Starter Booster
     */
    function registerAndActivate(address referrer) external nonReentrant {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(referrer != msg.sender, "Cannot refer yourself");
        
        address actualReferrer = users[referrer].isRegistered ? referrer : owner();

        uint256 starterCost = basePlanAmount * STARTER_MULT;
        require(usdtToken.transferFrom(msg.sender, address(this), starterCost), "USDT transfer failed");

        users[msg.sender] = User({
            isRegistered: true,
            referrer: actualReferrer,
            currentTier: BoosterTier.STARTER,
            totalEarnings: 0,
            directReferralsCount: 0,
            boosterCycleCount: 1,
            activeLevel: 1
        });

        directReferrals[actualReferrer].push(msg.sender);
        users[actualReferrer].directReferralsCount++;

        emit UserRegistered(msg.sender, actualReferrer);
        emit BoosterUpgraded(msg.sender, BoosterTier.STARTER, starterCost);

        // Process referral allocation
        _distributeBoosterReward(actualReferrer, starterCost, "Starter Referral Allocation");
    }

    /**
     * @notice Upgrade participant to next Booster tier (Builder, Leader, Champion)
     */
    function upgradeTier(BoosterTier targetTier) external nonReentrant {
        require(users[msg.sender].isRegistered, "User not registered");
        require(uint256(targetTier) == uint256(users[msg.sender].currentTier) + 1, "Must upgrade sequentially");

        uint256 upgradeCost = 0;
        if (targetTier == BoosterTier.BUILDER) upgradeCost = basePlanAmount * BUILDER_MULT;
        else if (targetTier == BoosterTier.LEADER) upgradeCost = basePlanAmount * LEADER_MULT;
        else if (targetTier == BoosterTier.CHAMPION) upgradeCost = basePlanAmount * CHAMPION_MULT;
        else revert("Invalid upgrade target");

        require(usdtToken.transferFrom(msg.sender, address(this), upgradeCost), "USDT transfer failed");

        users[msg.sender].currentTier = targetTier;
        emit BoosterUpgraded(msg.sender, targetTier, upgradeCost);

        // Distribute to referrer or matrix
        address ref = users[msg.sender].referrer;
        _distributeBoosterReward(ref, upgradeCost, "Booster Tier Upgrade Payout");
    }

    /**
     * @notice Trigger Main Plan Activation (100x Base Plan)
     */
    function activateMainPlan() external nonReentrant {
        require(users[msg.sender].isRegistered, "User not registered");
        require(users[msg.sender].currentTier == BoosterTier.CHAMPION, "Requires Champion tier");

        uint256 mainPlanCost = basePlanAmount * MAIN_MULT;
        require(usdtToken.transferFrom(msg.sender, address(this), mainPlanCost), "USDT transfer failed");

        users[msg.sender].currentTier = BoosterTier.MAIN_PLAN;
        emit MainPlanActivated(msg.sender, mainPlanCost);

        // 1. X5 Matrix Split (15%)
        uint256 x5Amount = (mainPlanCost * 15) / 100;
        _distributeBoosterReward(users[msg.sender].referrer, x5Amount, "X5 Matrix Allocation");

        // 2. 13-Level Forced Pool (65% -> 5% per level = 65% total)
        uint256 perLevelAmount = (mainPlanCost * 5) / 100;
        address currentUpline = users[msg.sender].referrer;
        for (uint256 level = 1; level <= 13; level++) {
            if (currentUpline == address(0)) break;
            _distributeBoosterReward(currentUpline, perLevelAmount, "13-Level Forced Pool");
            currentUpline = users[currentUpline].referrer;
        }

        // 3. X4 Passive Matrix Allocation (20%)
        uint256 x4Amount = (mainPlanCost * 20) / 100;
        _distributeBoosterReward(owner(), x4Amount, "X4 Passive Spillover Pool");
    }

    function _distributeBoosterReward(address recipient, uint256 amount, string memory distType) internal {
        if (recipient == address(0)) recipient = owner();
        users[recipient].totalEarnings += amount;
        require(usdtToken.transfer(recipient, amount), "Reward transfer failed");
        emit RewardDistributed(recipient, amount, distType);
    }

    function getDirectReferrals(address user) external view returns (address[] memory) {
        return directReferrals[user];
    }

    function updateBasePlanAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Amount must be > 0");
        basePlanAmount = newAmount;
    }
}
