/**
 * Created by lk on 18/4/28.
 */

const index = {
    'admin_list': {
        'total': 1,
        'per_page': 20,
        'current_page': '1',
        'last_page': 1,
        'data': [{
            'id': 1,
            'username': 'admin',
            'avatar': null,
            'tel': 'admin',
            'email': 'lmxdawn@gmail.com',
            'status': 1,
            'last_login_ip': '127.0.0.1',
            'last_login_time': 1493103488,
            'create_time': 1487868050,
            'roles': []
        }]
    },
    'role_list': [{
        'id': 1,
        'name': '超级管理员'
    }]
}

const save = {
    'id': '2',
    'username': 'test',
    'password': '',
    'status': '1',
    'roles': [1]
}

const edit = {
    'success': true
}

const del = {
    'success': true
}

export default {
    index,
    save,
    edit,
    del
}
