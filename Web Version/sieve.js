const fs = require('fs');
var sieve = [];
for (var i=0; i<=10000; i++) sieve[i] = true;
for (var i=2; i<=Math.sqrt(10000); i++) {
    if(!sieve[i]) continue;
    for(var j = i*i; j<=10000; j += i) {
        sieve[j] = false;
    }
}
fs.writeFileSync('primes.json', JSON.stringify({
    "arr": sieve
}));
