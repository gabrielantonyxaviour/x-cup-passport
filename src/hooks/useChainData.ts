import { useCallback, useEffect, useState } from "react";
import type { Address } from "viem";
import { publicClient } from "../lib/viem";
import { passportAbi, resolverAbi, predictionAbi } from "../lib/abi";
import { CONTRACTS } from "../config/chain";

const read = <T>(
  address: Address,
  abi: unknown,
  functionName: string,
  args?: unknown[],
) =>
  publicClient.readContract({
    address,
    abi: abi as never,
    functionName,
    args: args as never,
  }) as Promise<T>;

export type PassportData = {
  hasPassport: boolean;
  tokenId?: bigint;
  nation?: string;
  score: number;
  predictions: number;
  badges: number;
  tokenURI?: string;
};

export function usePassport(address?: Address) {
  const [data, setData] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!address) {
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const tokenId = await read<bigint>(
        CONTRACTS.passport,
        passportAbi,
        "tokenOf",
        [address],
      );
      if (tokenId === 0n) {
        setData({ hasPassport: false, score: 0, predictions: 0, badges: 0 });
        return;
      }
      const [p, uri] = await Promise.all([
        read<{
          nation: string;
          score: bigint;
          predictions: bigint;
          badges: bigint;
        }>(CONTRACTS.passport, passportAbi, "passportOf", [address]),
        read<string>(CONTRACTS.passport, passportAbi, "tokenURI", [tokenId]),
      ]);
      setData({
        hasPassport: true,
        tokenId,
        nation: p.nation,
        score: Number(p.score),
        predictions: Number(p.predictions),
        badges: Number(p.badges),
        tokenURI: uri,
      });
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, loading, refetch };
}

export type Fixture = {
  id: number;
  home: string;
  away: string;
  kickoff: number;
  resolved: boolean;
  result: number;
  homeScore: number;
  awayScore: number;
  demo: boolean;
};

export function useFixtures() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const next = await read<bigint>(
        CONTRACTS.resolver,
        resolverAbi,
        "nextMatchId",
      );
      const ids = Array.from(
        { length: Math.max(0, Number(next) - 1) },
        (_, i) => i + 1,
      );
      const list = await Promise.all(
        ids.map(async (id) => {
          const f = await read<{
            home: string;
            away: string;
            kickoff: bigint;
            result: number;
            homeScore: number;
            awayScore: number;
            demoFixture: boolean;
            resolved: boolean;
          }>(CONTRACTS.resolver, resolverAbi, "fixtureOf", [BigInt(id)]);
          return {
            id,
            home: f.home,
            away: f.away,
            kickoff: Number(f.kickoff),
            resolved: f.resolved,
            result: f.result,
            homeScore: f.homeScore,
            awayScore: f.awayScore,
            demo: f.demoFixture,
          };
        }),
      );
      setFixtures(list);
    } catch {
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { fixtures, loading, refetch };
}

export function useStats() {
  const [stats, setStats] = useState<{
    passports: number;
    predictions: number;
  } | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const [minted, nextPred] = await Promise.all([
          read<bigint>(CONTRACTS.passport, passportAbi, "totalMinted"),
          read<bigint>(CONTRACTS.pool, predictionAbi, "nextPredictionId"),
        ]);
        setStats({
          passports: Number(minted),
          predictions: Math.max(0, Number(nextPred) - 1),
        });
      } catch {
        setStats(null);
      }
    })();
  }, []);
  return stats;
}

export function useIsOwner(address?: Address) {
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    if (!address) {
      setIsOwner(false);
      return;
    }
    read<Address>(CONTRACTS.resolver, resolverAbi, "owner")
      .then((o) => setIsOwner(o.toLowerCase() === address.toLowerCase()))
      .catch(() => setIsOwner(false));
  }, [address]);
  return isOwner;
}

export type FanPrediction = {
  id: number;
  matchId: number;
  pick: number;
  points: number;
  settled: boolean;
  message: string;
};

export function useFanPredictions(address?: Address) {
  const [items, setItems] = useState<FanPrediction[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!address) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const ids = await read<bigint[]>(
        CONTRACTS.pool,
        predictionAbi,
        "fanPredictions",
        [address],
      );
      const list = await Promise.all(
        ids.map(async (id) => {
          const p = await read<{
            matchId: bigint;
            pick: number;
            points: bigint;
            settled: boolean;
            message: string;
          }>(CONTRACTS.pool, predictionAbi, "predictionOf", [id]);
          return {
            id: Number(id),
            matchId: Number(p.matchId),
            pick: p.pick,
            points: Number(p.points),
            settled: p.settled,
            message: p.message,
          };
        }),
      );
      setItems(list);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, loading, refetch };
}
