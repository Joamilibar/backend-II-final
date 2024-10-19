import Utils from '../common/utils.js';

const isValidEmail = Utils.isValidEmail;


export default class RegisterDTO {
    email = null;
    password = null;
    first_name = null;
    last_name = null;
    age = null;
    role = null;

    constructor({
        email,
        password,
        first_name,
        last_name,
        age,
        role

    } = {}) {
        if (!email || !this.isValidEmail(email)) {
            throw new Error('Invalid email');
        }
        if (!password || typeof password !== 'string' || password.length < 5) {
            throw new Error('Invalid password');
        }
        if (!first_name || typeof first_name !== 'string') {
            throw new Error('Invalid first_name');
        }
        if (!last_name || typeof last_name !== 'string') {
            throw new Error('Invalid last_name');
        }
        if (!age || isNaN(age) || age < 18 || age > 100) {
            throw new Error('Invalid age');
        }
        if (!role || typeof role !== 'string' || !['admin', 'user'].includes(role)) {
            throw new Error('Invalid role');
        }

        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.age = age;
        this.role = role;



    }


}