# `StaticArrayBuffer` and `StaticBuffer`

`StaticArrayBuffer` and `StaticBuffer` extend `ArrayBuffer` and `Buffer` classes and 
provide such extra functionality:

 1. Allocate executable memory.
 2. Execute the machine code in `StaticBuffer` using `.call()` method.
 3. Change protection to backing memory.
 4. Promise that actual data in memory will never be moved by runtime.

Memory protection:

 - 'r' - readable
 - 'w' - writable
 - 'e' - executable

Usage:

```js
var StaticArrayBuffer = require('static-buffer/arraybuffer').StaticArrayBuffer;
var StaticBuffer = require('static-buffer/buffer').StaticArrayBuffer;
```

`StaticArrayBuffer` inherits from `ArrayBuffer` and provides the following
extra functionality:

```js
var sab = new StaticArrayBuffer(1024, 'rwe');
StaticArrayBuffer.isStaticArrayBuffer(sab); // true

// Call mathine code stored in `StaticArrayBuffer` at offset `offset`,
// providing `number[]` arguments to that machine code using standard
// calling conventions supported by your system, currently supports 
// up to 10 arguments.
var offset = 0;
var args = [1, 2, 3];
sab.call(args, offset);

// Change protection of the memory block.
sab.setProtection('rw');

// Get the actual address pointer of the memory that backs the `StaticArrayBuffer`.
offset = 0;
var addr = sab.getAddress(offset); // [number, number]

// Free the memory of the `StaticArrayBuffer`, after that your `StaticArrayBuffer`
// should not be used.
sab.free();
sab = null;
```

`StaticBuffer` inherits from [`Buffer`](https://nodejs.org/docs/latest/api/buffer.html) and
is backed by `StaticArrayBuffer` instead of `ArrayBuffer` that `Buffer` uses. It provides 
the following extra functionality:

```js
var sbuf = new StaticBuffer(1024, 'rwe');
// or
var offset = 10, len = 10;
sbuf = new StaticBuffer(sab, offset, len);
// or use StaticBuffer.from() syntax

StaticBuffer.isStaticBuffer(sbuf); // true

sbuf.call([], 0);
sbuf.getAddress(0);

sbuf.buffer.free();
sbuf = null;
```

## Hello World Example

Print `"Hello World"` to console, we do it by executing `write` system call to `1` file
descriptor which is `STDOUT`:

```js
var StaticBuffer = require('static-buffer/buffer').StaticBuffer;

var sbuf = StaticBuffer.from([
    0x48, 0xc7, 0xc0, 1, 0, 0, 0,       // mov    $0x1,%rax         # System call `1` -- SYS_write
    0x48, 0xc7, 0xc7, 1, 0, 0, 0,       // mov    $0x1,%rdi         # File descriptor `1` -- STDOUT
    0x48, 0x8d, 0x35, 10, 0, 0, 0,      // lea    0x1(%rip),%rsi    # Data address
    0x48, 0xc7, 0xc2, 13, 0, 0, 0,      // mov    $13,%rdx          # Number of bytes to write -- 13
    0x0f, 0x05,                	        // syscall                  # Execute the system call.
    0xc3,                               // retq                     # Return
    0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x20, // Hello_
    0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21, // World!
    0x0A, 0                             // \n\0
], 'rwe');

sbuf.call([], 0); // Hello World!
```
