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

'use strict';

const { getAddressFromPublicKey } = require('@liskhq/lisk-cryptography');
const { omitBy, isNull } = require('lodash');
const BigNum = require('@liskhq/bignum');

/**
 * Creates block object based on raw data.
 *
 * @param {Object} raw
 * @returns {null|block} Block object
 * @todo Add description for the params
 */
const dbRead = raw => {
	if (!raw.b_id) {
		return null;
	}
	const block = {
		id: raw.b_id,
		version: parseInt(raw.b_version, 10),
		timestamp: parseInt(raw.b_timestamp, 10),
		height: parseInt(raw.b_height, 10),
		previousBlock: raw.b_previousBlock,
		numberOfTransactions: parseInt(raw.b_numberOfTransactions, 10),
		totalAmount: new BigNum(raw.b_totalAmount),
		totalFee: new BigNum(raw.b_totalFee),
		reward: new BigNum(raw.b_reward),
		payloadLength: parseInt(raw.b_payloadLength, 10),
		payloadHash: raw.b_payloadHash,
		generatorPublicKey: raw.b_generatorPublicKey,
		generatorId: getAddressFromPublicKey(raw.b_generatorPublicKey),
		blockSignature: raw.b_blockSignature,
		confirmations: parseInt(raw.b_confirmations, 10),
	};
	block.totalForged = block.totalFee.plus(block.reward).toString();
	return block;
};

/**
 * Creates block object based on raw database block data.
 *
 * @param {Object} raw Raw database data block object
 * @returns {null|block} Block object
 */
const storageRead = raw => {
	if (!raw.id) {
		return null;
	}

	const block = {
		id: raw.id,
		version: parseInt(raw.version, 10),
		timestamp: parseInt(raw.timestamp, 10),
		height: parseInt(raw.height, 10),
		previousBlock: raw.previousBlockId,
		numberOfTransactions: parseInt(raw.numberOfTransactions, 10),
		totalAmount: new BigNum(raw.totalAmount),
		totalFee: new BigNum(raw.totalFee),
		reward: new BigNum(raw.reward),
		payloadLength: parseInt(raw.payloadLength, 10),
		payloadHash: raw.payloadHash,
		generatorPublicKey: raw.generatorPublicKey,
		generatorId: getAddressFromPublicKey(raw.generatorPublicKey),
		blockSignature: raw.blockSignature,
		confirmations: parseInt(raw.confirmations, 10),
	};

	if (raw.transactions) {
		block.transactions = raw.transactions
			.filter(tx => !!tx.id)
			.map(tx => omitBy(tx, isNull));
	}

	block.totalForged = block.totalFee.plus(block.reward).toString();

	return block;
};

module.exports = {
	dbRead,
	storageRead,
};
