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

/// @notice Deploys the 4 X Cup contracts, wires the prediction game authorization,
///         and seeds the simulated World Cup 2026 fixture set (demoFixture = true,
///         clearly labeled pre-tournament in the UI). Result outcomes are admin/owner
///         simulated; no live sports oracle is claimed.
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

        // Seed simulated WC2026 group-stage fixtures (kickoffs in June 2026).
        // demoFixture = true => UI labels these as pre-tournament simulation.
        resolver.createMatch("Mexico", "Croatia", 1781301600, true);   // Jun 11 2026 opener (Azteca)
        resolver.createMatch("USA", "Wales", 1781388000, true);        // Jun 12 2026
        resolver.createMatch("Canada", "Belgium", 1781474400, true);   // Jun 13 2026
        resolver.createMatch("Argentina", "Nigeria", 1781560800, true);// Jun 14 2026
        resolver.createMatch("Brazil", "Serbia", 1781647200, true);    // Jun 15 2026
        resolver.createMatch("France", "Australia", 1781733600, true); // Jun 16 2026
        resolver.createMatch("England", "Iran", 1781820000, true);     // Jun 17 2026
        resolver.createMatch("Spain", "Japan", 1781906400, true);      // Jun 18 2026

        vm.stopBroadcast();

        emit Deployed(address(passport), address(resolver), address(pool), address(bond));
    }
}
