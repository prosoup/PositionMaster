pragma solidity ^0.8.0;

contract Analytics {
    mapping(address => uint256) public totalLiquidity;

    event LiquidityAdded(address indexed owner, uint256 liquidity);
    event LiquidityRemoved(address indexed owner, uint256 liquidity);

    function addLiquidity(uint256 amount) public {
        totalLiquidity[msg.sender] += amount;
        emit LiquidityAdded(msg.sender, amount);
    }

    function removeLiquidity(uint256 amount) public {
        require(totalLiquidity[msg.sender] >= amount, "Insufficient liquidity");
        totalLiquidity[msg.sender] -= amount;
        emit LiquidityRemoved(msg.sender, amount);
    }

    function getLiquidity(address owner) public view returns (uint256) {
        return totalLiquidity[owner];
    }
}
