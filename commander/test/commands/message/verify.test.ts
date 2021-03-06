/*
 * LiskHQ/lisk-commander
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
 *
 */
import * as sandbox from 'sinon';
import { expect, test } from '@oclif/test';
import * as cryptography from '@liskhq/lisk-cryptography';
import * as printUtils from '../../../src/utils/print';
import * as readerUtils from '../../../src/utils/reader';

describe('message:verify', () => {
	const message = 'Hello World';
	const defaultPublicKey = 'a4465fd76c16fcc458448076372abf1912cc5b150663a64dffefe550f96feadd';
	const defaultSignature =
		'0c70c0ed6ca16312c6acab46dd8b801fd3f3a2bd68018651c2792b40a7d1d3ee276a6bafb6b4185637edfa4d282e18362e135c5e2cf0c68002bfd58307ddb30b';
	const defaultData = 'message';
	const defaultVerifyMessageResult = true;

	const printMethodStub = sandbox.stub();
	const setupTest = () =>
		test
			.stub(printUtils, 'print', sandbox.stub().returns(printMethodStub))
			.stub(
				cryptography,
				'verifyMessageWithPublicKey',
				sandbox.stub().returns(defaultVerifyMessageResult),
			)
			.stub(readerUtils, 'readFileSource', sandbox.stub().resolves(defaultData))
			.stdout();

	describe('message:verify', () => {
		setupTest()
			.command(['message:verify'])
			.catch((error: Error) => {
				return expect(error.message).to.contain('Missing 2 required arg');
			})
			.it('should throw an error');
	});

	describe('message:verify publicKey', () => {
		setupTest()
			.command(['message:verify', defaultPublicKey])
			.catch((error: Error) => {
				return expect(error.message).to.contain('Missing 1 required arg');
			})
			.it('should throw an error');
	});

	describe('message:verify publicKey signature', () => {
		setupTest()
			.command(['message:verify', defaultPublicKey, defaultSignature])
			.catch((error: Error) => {
				return expect(error.message).to.contain('No message was provided.');
			})
			.it('should throw an error');
	});

	describe('message:verify publicKey signature message', () => {
		setupTest()
			.command(['message:verify', defaultPublicKey, defaultSignature, message])
			.it('should verify message from the arg', () => {
				expect(readerUtils.readFileSource).not.to.be.called;

				expect(cryptography.verifyMessageWithPublicKey).to.be.calledWithExactly({
					publicKey: Buffer.from(defaultPublicKey, 'hex'),
					signature: Buffer.from(defaultSignature, 'hex'),
					message,
				});
				return expect(printMethodStub).to.be.calledWithExactly({
					verified: defaultVerifyMessageResult,
				});
			});
	});

	describe('message:verify publicKey signature --message=file:./message.txt', () => {
		const messageSource = 'file:/message.txt';
		setupTest()
			.command(['message:verify', defaultPublicKey, defaultSignature, `--message=${messageSource}`])
			.it('should verify message from the flag', () => {
				expect(readerUtils.readFileSource).not.to.be.calledWithExactly('file:./message.txt');
				expect(cryptography.verifyMessageWithPublicKey).to.be.calledWithExactly({
					publicKey: Buffer.from(defaultPublicKey, 'hex'),
					signature: Buffer.from(defaultSignature, 'hex'),
					message: defaultData,
				});
				return expect(printMethodStub).to.be.calledWithExactly({
					verified: defaultVerifyMessageResult,
				});
			});
	});
});
