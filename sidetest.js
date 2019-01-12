const simplereq = require('./simplerequest');

const html = simplereq.make_request('https://arstechnica.com/gaming/2019/01/unity-engine-tos-change-makes-cloud-based-spatialos-games-illegal/', (data) => {
    console.log(data);
});
