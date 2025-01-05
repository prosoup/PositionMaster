pragma solidity ^0.8.0;

contract PositionManager {
    struct Position {
        uint256 liquidity;
        uint256 stakeAmount;
        address owner;
        uint256 riskLevel;
    }

    mapping(address => Position[]) public userPositions;

    event PositionCreated(address indexed owner, uint256 liquidity, uint256 stakeAmount, uint256 riskLevel);
    event PositionRebalanced(address indexed owner, uint256 newLiquidity);

    function createPosition(uint256 liquidity, uint256 stakeAmount, uint256 riskLevel) public {
        Position memory newPosition = Position({
            liquidity: liquidity,
            stakeAmount: stakeAmount,
            owner: msg.sender,
            riskLevel: riskLevel
        });
        userPositions[msg.sender].push(newPosition);
        emit PositionCreated(msg.sender, liquidity, stakeAmount, riskLevel);
    }

    function rebalancePosition(uint256 positionId, uint256 newLiquidity) public {
        Position storage position = userPositions[msg.sender][positionId];
        require(position.owner == msg.sender, "Not the owner of the position");
        position.liquidity = newLiquidity;
        emit PositionRebalanced(msg.sender, newLiquidity);
    }
}
