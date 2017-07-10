const protos = require('../proto/index.js');

module.exports = {
	sender: function (response) {
		response.envelope.platform_returns = response.envelope.platform_returns || [];
		response.envelope.platform_returns.push(
			new protos.Networking.Envelopes.ResponseEnvelope.PlatformResponse(
				{
					"type": protos.Networking.Platform.PlatformRequestType.SEND_ENCRYPTED_SIGNATURE,
					"response": new protos.Networking.Platform.Responses.SendEncryptedSignatureResponse(
						{
							"received": true,
						}
					).encode().toBuffer(),
				}
			)
		);
		
		return response.end(new protos.Networking.Envelopes.ResponseEnvelope(response.envelope).encode().toBuffer());
	},
}