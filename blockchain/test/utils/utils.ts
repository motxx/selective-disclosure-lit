// Helper functions for testing
import { BigNumber as BN } from 'ethers';
import hash from './cryptography';

export function randomAddress(): string {
	return hash(BN.from(Math.floor(Math.random() * 1_000_000)).toHexString()).slice(0, 42);
}

export function randomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

export function uintToBytes32(i: number): string {
	const value = BN.from(i).toHexString();
	let trimmedValue = value.slice(2);
	trimmedValue = '0'.repeat(64 - trimmedValue.length).concat(trimmedValue);
	return '0x'.concat(trimmedValue);
}

export function padUint(value: BN): string {
	// uint256 is encoded as 32 bytes, so pad that string.
	let trimmedValue = value.toHexString().slice(2);
	trimmedValue = '0'.repeat(64 - trimmedValue.length).concat(trimmedValue);
	return '0x'.concat(trimmedValue);
}

// Does a util exist for this in ethers.js ?
export function padBytes(value: string): string {
	let trimmedValue = value.slice(2);
	trimmedValue = '0'.repeat(64 - trimmedValue.length).concat(trimmedValue);
	return '0x'.concat(trimmedValue);
}
