import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ScreenshotRenderApi implements ICredentialType {
	name = 'screenshotRenderApi';

	displayName = 'ScreenshotRender API';

	documentationUrl = 'https://screenshotrender.com';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your ScreenshotRender API key (starts with "sr-"). Find it at screenshotrender.com/dashboard.',
		},
	];

	// Inject the key as a query string parameter on every request.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				apiKey: '={{$credentials.apiKey}}',
			},
		},
	};

	// Validate the key by capturing a tiny known page.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://screenshotrender.com/api/v1',
			url: '/screenshot',
			method: 'GET',
			qs: {
				url: 'https://example.com',
			},
		},
	};
}
