import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 1,
    duration: '10s',
};

export default function () {
    let url = "http://localhost:8080/customer/create";

    let payload = JSON.stringify({
        phoneNumber: `0${[3, 5, 7, 8, 9][Math.floor(Math.random() * 5)]}${Math.floor(10000000 + Math.random() * 9000000)}`,
        firstName: "John",
        lastName: "Doe",
        dob: "2000-01-01",
        gender: true,
        password: "password123",
        address: "123 Test Street",
        banking: "Bank XYZ",
        email: `user${Math.floor(Math.random() * 100000)}@test.com`,
        roleId: 1,
        active: true
    });


    let params = {
        headers: { "Content-Type": "application/json" },
        tags: { name: "CreateCustomer" }
    };

    let res = http.post(url, payload, params);

    check(res, {
        "status is 200 or 201": (r) => r.status === 200 || r.status === 201,
    });
    

}
