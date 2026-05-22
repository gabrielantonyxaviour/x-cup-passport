// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../src/XCupPassport.sol";
import "../src/MatchResolver.sol";
import "../src/PredictionPool.sol";
import "../src/BanterBond.sol";

interface Vm {
    function startBroadcast() external;
    function stopBroadcast() external;
}

contract Deploy {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    event Deployed(address passport, address resolver, address pool, address bond);

    function run() external {
        vm.startBroadcast();

        XCupPassport passport = new XCupPassport();
        MatchResolver resolver = new MatchResolver();
        PredictionPool pool = new PredictionPool(address(passport), address(resolver));
        BanterBond bond = new BanterBond(address(resolver));
        passport.setGameAuthorization(address(pool), true);

        vm.stopBroadcast();

        emit Deployed(address(passport), address(resolver), address(pool), address(bond));
    }
}
