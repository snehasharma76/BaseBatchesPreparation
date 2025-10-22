/**
 * Hook for watching and managing contract events in real-time
 * Listens to all VotingContract events and maintains a local event feed
 */

import { useEffect, useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from '@/utils/contractConfig';

/**
 * Interface for contract events
 */
export interface ContractEvent {
  id: string; // Unique identifier (transactionHash-logIndex)
  type: 'ProposalCreated' | 'VoteCast' | 'ProposalClosed' | 'ProposerApproved' | 'ProposerRemoved';
  timestamp: number; // Client-side timestamp when event was received
  data: Record<string, unknown>; // Event-specific data
}

/**
 * Hook to watch all contract events in real-time
 * @returns Object containing array of recent events (max 50)
 */
export function useContractEvents() {
  const [events, setEvents] = useState<ContractEvent[]>([]);

  // Watch ProposalCreated events - emitted when a new proposal is created
  useWatchContractEvent({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    eventName: 'ProposalCreated',
    onLogs(logs) {
      logs.forEach((log) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'ProposalCreated',
          timestamp: Date.now(),
          data: {
            proposalId: log.args.proposalId,
            description: log.args.description,
            endTime: log.args.endTime,
          },
        };
        setEvents((prev) => [event, ...prev].slice(0, 50)); // Keep last 50 events
      });
    },
  });

  // Watch VoteCast events - emitted when someone votes on a proposal
  useWatchContractEvent({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    eventName: 'VoteCast',
    onLogs(logs) {
      logs.forEach((log) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'VoteCast',
          timestamp: Date.now(),
          data: {
            proposalId: log.args.proposalId,
            voter: log.args.voter,
          },
        };
        setEvents((prev) => [event, ...prev].slice(0, 50));
      });
    },
  });

  // Watch ProposalClosed events - emitted when a proposal is closed
  useWatchContractEvent({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    eventName: 'ProposalClosed',
    onLogs(logs) {
      logs.forEach((log) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'ProposalClosed',
          timestamp: Date.now(),
          data: {
            proposalId: log.args.proposalId,
            approved: log.args.approved,
          },
        };
        setEvents((prev) => [event, ...prev].slice(0, 50));
      });
    },
  });

  // Watch ProposerApproved events - emitted when owner approves a new proposer
  useWatchContractEvent({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    eventName: 'ProposerApproved',
    onLogs(logs) {
      logs.forEach((log) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'ProposerApproved',
          timestamp: Date.now(),
          data: {
            proposer: log.args.proposer,
          },
        };
        setEvents((prev) => [event, ...prev].slice(0, 50));
      });
    },
  });

  // Watch ProposerRemoved events - emitted when owner removes a proposer
  useWatchContractEvent({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_CONTRACT_ABI,
    eventName: 'ProposerRemoved',
    onLogs(logs) {
      logs.forEach((log) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'ProposerRemoved',
          timestamp: Date.now(),
          data: {
            proposer: log.args.proposer,
          },
        };
        setEvents((prev) => [event, ...prev].slice(0, 50));
      });
    },
  });

  return { events };
}
