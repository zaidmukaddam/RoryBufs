import type { Field, Reader, Writer } from "../field.d.ts";
import { assertWithin, readAll, writeAll } from "../utils.ts";

export class I64 implements Field<bigint> {
	readonly size = 8;
	encode(value: bigint, buf: DataView, offset = 0) {
		assertWithin(
			value,
			-0x10000000000000000n / 2n,
			0x10000000000000000n / 2n - 1n,
		);
		buf.setBigInt64(offset, value);
		return this.size;
	}
	decode(buf: DataView, offset = 0) {
		return { bytesRead: this.size, value: buf.getBigInt64(offset) };
	}
	write(value: bigint, stream: Writer) {
		const buf = new ArrayBuffer(this.size);
		const dv = new DataView(buf);
		this.encode(value, dv);
		return writeAll(stream, new Uint8Array(buf));
	}
	async read(stream: Reader) {
		const buf = new ArrayBuffer(this.size);
		await readAll(stream, new Uint8Array(buf));
		const dv = new DataView(buf);
		return this.decode(dv);
	}
}
