/*
 * Copyright © 2019 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */
import { randomInt } from './random_int';
import * as delegatePublicKeys from '../fixtures/delegate_publickeys.json';
import { Account } from '../../src/types';

export { delegatePublicKeys };

export const delegateAccounts = delegatePublicKeys.map((pk, index) => {
	const balance = BigInt(randomInt(100, 1000));
	const rewards = BigInt(randomInt(100, 500));
	const voteWeight = BigInt(randomInt(10000, 50000));
	return {
		balance,
		rewards,
		voteWeight,
		fees: balance - rewards,
		publicKey: pk,
		votedDelegatesPublicKeys: [
			`abc${index}`,
			`def${index}`,
			`xyz${index % 10}`,
		], // array with 2 uniq and one shared public key
	};
});

const missedDelegateCount = 5;

// First Delegate forged 3 times
export const delegatesWhoForgedThrice = delegateAccounts.slice(0, 1);

// 2nd-4th forges 2 times
export const delegatesWhoForgedTwice = delegateAccounts.slice(1, 4);

// 5th forges 1 time and misses 1 time
export const delegatesWhoForgedOnceMissedOnce = delegateAccounts.slice(4, 5);

// last 5 in the list
export const delegatesWhoForgedNone = delegateAccounts.slice(
	-missedDelegateCount,
);

export const delegatesWhoMissed = [
	...delegatesWhoForgedNone,
	...delegatesWhoForgedOnceMissedOnce,
];

// rest of the delegates forged once
export const delegatesWhoForgedOnce = delegateAccounts.filter(
	d =>
		![
			...delegatesWhoForgedNone.map(a => a.publicKey),
			...delegatesWhoForgedTwice.map(a => a.publicKey),
			...delegatesWhoForgedThrice.map(a => a.publicKey),
			...delegatesWhoForgedOnceMissedOnce.map(a => a.publicKey),
		].includes(d.publicKey),
);

export const delegatesWhoForged = [
	...delegatesWhoForgedThrice,
	...delegatesWhoForgedTwice,
	...delegatesWhoForgedOnce,
	...delegatesWhoForgedTwice,
	...delegatesWhoForgedThrice,
	...delegatesWhoForgedOnceMissedOnce,
	...delegatesWhoForgedThrice,
];

export const uniqueDelegatesWhoForged = delegatesWhoForged.filter(
	(d, index) =>
		delegatesWhoForged.findIndex(a => a.publicKey === d.publicKey) === index,
);

export const delegateWhoForgedLast =
	delegatesWhoForged[delegatesWhoForged.length - 1];

/**
 * sorted by [voteWeight:Desc] [publicKey:asc]
 */
// eslint-disable-next-line consistent-return, array-callback-return
export const sortedDelegateAccounts = delegateAccounts.sort(
	(a: Account, b: Account) => {
		if (b.voteWeight === a.voteWeight) {
			return a.publicKey.localeCompare(b.publicKey); // publicKey sorted by ascending
		}

		if (b.voteWeight > a.voteWeight) {
			return 1; // voteWeight sorted by descending
		}

		if (b.voteWeight < a.voteWeight) {
			return -1;
		}

		return 0;
	},
);

export const sortedDelegatePublicKeys = sortedDelegateAccounts.map(
	account => account.publicKey,
);

if (delegatesWhoForged.length !== delegateAccounts.length) {
	throw new Error('delegatesWhoForged is miscalculated');
}

if (
	uniqueDelegatesWhoForged.length !==
	delegateAccounts.length - missedDelegateCount
) {
	throw new Error('uniqueDelegatesWhoForged is miscalculated');
}