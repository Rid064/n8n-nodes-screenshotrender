import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

export class ScreenshotRender implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ScreenshotRender',
		name: 'screenshotRender',
		icon: 'file:screenshotrender.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ "Capture: " + $parameter["url"] }}',
		description: 'Capture website screenshots with the ScreenshotRender API',
		usableAsTool: true,
		defaults: {
			name: 'ScreenshotRender',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'screenshotRenderApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com',
				description: 'The web page to capture',
			},
			{
				displayName: 'Full Page',
				name: 'fullPage',
				type: 'boolean',
				default: false,
				description: 'Whether to capture the entire scrollable page instead of just the viewport',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Wait',
						name: 'wait',
						type: 'number',
						default: 0,
						description: 'Milliseconds to wait after load before capturing, for late-rendering content',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 30000,
						description: 'Maximum milliseconds to wait for the page before failing',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const url = this.getNodeParameter('url', i) as string;
				const fullPage = this.getNodeParameter('fullPage', i) as boolean;
				const options = this.getNodeParameter('options', i, {}) as IDataObject;

				const qs: IDataObject = {
					url,
					fullPage,
				};
				if (options.wait !== undefined && options.wait !== 0) qs.wait = options.wait;
				if (options.timeout !== undefined) qs.timeout = options.timeout;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'screenshotRenderApi',
					{
						method: 'GET',
						baseURL: 'https://screenshotrender.com/api/v1',
						url: '/screenshot',
						qs,
						json: true,
					},
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
