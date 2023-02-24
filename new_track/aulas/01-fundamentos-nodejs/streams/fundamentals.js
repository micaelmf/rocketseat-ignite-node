// process.stdin.pipe(process.stdout)

import { Readable, Writable, Transform } from "node:stream";

class OneToHundredStream extends Readable {
    index = 1
    _read() {
        const i = this.index++

        setTimeout(() => {
            if (i > 100) {
                this.push(null)
            } else {
                const buffer = Buffer.from(String(i))
                this.push(buffer)
            }
        }, (1000));

    }
}

class MultiplyByTenStream extends Writable {

    // chuck possui o conteúdo do buffer
    _write(chunk, encoding, callback) {
        console.log(Number(chunk.toString()) * 10)
        callback()
    }
}

class IverseNumberStream extends Transform {
    _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1
        callback(null, Buffer.from(String(transformed)))
    }
}

// stream de leitura
// new OneToHundredStream().pipe(process.stdout) 

// stream de escrita
// new OneToHundredStream().pipe(new MultiplyByTenStream()) 

// stream de transformação
new OneToHundredStream()
    .pipe(new IverseNumberStream())
    .pipe(new MultiplyByTenStream())

