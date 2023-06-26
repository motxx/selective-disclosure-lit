import { WebBundlr } from '@bundlr-network/client';
import { Web3 } from './web3';

export class Bundlr {
  private bundlr: WebBundlr;
  constructor(web3: Web3) {
    this.bundlr = new WebBundlr(
      'http://node2.bundlr.network',
      'matic',
      web3.provider,
    );
  }

  async upload(data: string) {
    const byteLength = new TextEncoder().encode(data).length;

    // Lazy-Funding
    const price = await this.bundlr.getPrice(byteLength);
    const fundResponse = await this.bundlr.fund(price);
    console.log('bundlr.fund() ===>', fundResponse);

    // Upload data
    const uploadResponse = await this.bundlr.upload(data);
    console.log('bundlr.upload() ===>', uploadResponse);

    return uploadResponse.id;
  }

  createDownloadURL(id: string) {
    return `https://arweave.net/${id}`;
  }
}
