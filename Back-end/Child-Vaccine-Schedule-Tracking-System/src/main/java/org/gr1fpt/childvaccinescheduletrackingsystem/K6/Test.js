import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 20,  // 10 user ảo gửi request đồng thời
    duration: '10s',  // Chạy trong 10 giây
};

export default function () {
    let res = http.get('http://localhost:8080/customer');

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}
