var StaticArrayBuffer = require('./arraybuffer').StaticArrayBuffer;
var StaticBuffer = require('./buffer').StaticBuffer;


var sbuf = StaticBuffer.from([
    0x48, 0xc7, 0xc0, 1, 0, 0, 0,       // mov    $0x1,%rax         # System call `1` -- SYS_write
    0x48, 0xc7, 0xc7, 1, 0, 0, 0,       // mov    $0x1,%rdi         # File descriptor `1` -- STDOUT
    0x48, 0x8d, 0x35, 10, 0, 0, 0,      // lea    0x1(%rip),%rsi    # Data address
    0x48, 0xc7, 0xc2, 13, 0, 0, 0,      // mov    $13,%rdx          # Number of bytes to write -- 0xd = 13
    0x0f, 0x05,                         // syscall                  # Execute the system call.
    0xc3,                  	            // retq                     # Return
    0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x20, // Hello_
    0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21, // World!
    0x0A, 0                             // \n\0
], 'rwe');

// console.log(sbuf);

sbuf.call();


// var sab = new StaticArrayBuffer(20, 'rwe');
// console.log(sab.getAddress());
// console.log(sab.getAddress(5));

// console.log(sab instanceof StaticArrayBuffer);
// console.log(sab instanceof ArrayBuffer);

// var sbuf = new StaticBuffer(30, 'rwe');
// var sbuf = StaticBuffer.from(sab);
// console.log(sbuf.getAddress());
//
// sbuf[1] = 36;
// sbuf[2] = 37;
// sbuf[3] = 38;
//
// console.log(sbuf);
// var sbuf2 = sbuf.slice(2, 5);
// console.log(sbuf2);


// var buf = new StaticBuffer(10, 'rwe');
// var buf = StaticBuffer.alloc(10, 'rwe');
// buf.writeUInt16BE(0xFFAA, 2);
// console.log(buf);
