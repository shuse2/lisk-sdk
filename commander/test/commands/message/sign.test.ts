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

describe('message:sign', () => {
	const message = 'Hello World';
	const defaultSignedMessage = {
		message,
		publicKey: 'a4465fd76c16fcc458448076372abf1912cc5b150663a64dffefe550f96feadd',
		signature:
			'0c70c0ed6ca16312c6acab46dd8b801fd3f3a2bd68018651c2792b40a7d1d3ee276a6bafb6b4185637edfa4d282e18362e135c5e2cf0c68002bfd58307ddb30b',
	};
	const defaultInputs =
		'card earn shift valley learn scorpion cage select help title control satoshi';
	const defaultData = 'message';

	const printMethodStub = sandbox.stub();
	const setupTest = () =>
		test
			.stub(printUtils, 'print', sandbox.stub().returns(printMethodStub))
			.stub(cryptography, 'signMessageWithPassphrase', sandbox.stub().returns(defaultSignedMessage))
			.stub(readerUtils, 'getPassphraseFromPrompt', sandbox.stub().resolves(defaultInputs))
			.stub(readerUtils, 'readFileSource', sandbox.stub().resolves(defaultData))
			.stdout();

	describe('message:sign', () => {
		setupTest()
			.command(['message:sign'])
			.catch((error: Error) => {
				return expect(error.message).to.contain('No message was provided.');
			})
			.it('should throw an error');
	});

	describe('message:sign message', () => {
		setupTest()
			.command(['message:sign', message])
			.it('should sign the message with the arg', () => {
				expect(readerUtils.getPassphraseFromPrompt).to.be.calledWithExactly('passphrase', true);
				expect(readerUtils.readFileSource).not.to.be.calledWithExactly('file:./message.txt');
				expect(cryptography.signMessageWithPassphrase).to.be.calledWithExactly(
					message,
					defaultInputs,
				);
				return expect(printMethodStub).to.be.calledWithExactly(defaultSignedMessage);
			});
	});

	describe('message:sign --message=file:./message.txt', () => {
		const messageSource = 'file:/message.txt';
		setupTest()
			.command(['message:sign', `--message=${messageSource}`])
			.it('should sign the message from flag', () => {
				expect(readerUtils.getPassphraseFromPrompt).to.be.calledWithExactly('passphrase', true);
				expect(readerUtils.readFileSource).not.to.be.calledWithExactly('file:./message.txt');
				expect(cryptography.signMessageWithPassphrase).to.be.calledWithExactly(
					defaultData,
					defaultInputs,
				);
				return expect(printMethodStub).to.be.calledWithExactly(defaultSignedMessage);
			});
	});

	describe('message:sign --message=file:./message.txt --passphrase=card earn shift valley learn scorpion cage select help title control satoshi', () => {
		const messageSource = 'file:/message.txt';
		const passphraseSource =
			'card earn shift valley learn scorpion cage select help title control satoshi';
		setupTest()
			.command(['message:sign', `--message=${messageSource}`, `--passphrase=${passphraseSource}`])
			.it('should sign the message from the flag and passphrase', () => {
				expect(readerUtils.getPassphraseFromPrompt).not.to.be.calledWithExactly('passphrase');
				expect(readerUtils.readFileSource).not.to.be.calledWithExactly('file:./message.txt');
				expect(cryptography.signMessageWithPassphrase).to.be.calledWithExactly(
					defaultData,
					defaultInputs,
				);
				return expect(printMethodStub).to.be.calledWithExactly(defaultSignedMessage);
			});
	});
});
