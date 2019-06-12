function Login() {
    console.log('Login Constructor');
    this.init();
    this.bindEvent();
}

Login.prototype.init = function() {
    console.log('Login init');
    this.$loginBtn = $('#loginBtn');
    this.$registerBtn = $('#registerBtn');
    this.$loginBox = $('.loginBox');
    this.$registerBox = $('.registerBox');
}

Login.prototype.bindEvent = function() {
    console.log('Login bindEvent');
    const self = this;

    this.$loginBtn.on('click', function() {
        self.$loginBox.show();
        self.$registerBtn.hide();
    });

    this.$registerBtn.on('click', function() {
        self.$loginBox.hide();
        self.$registerBtn.show();
    });

    this.$loginBox.find('form').submit(function(e) {
        e.preventDefault();

        const name = self.$loginBox.find('#name').val();
        const pswd = self.$loginBox.find('#password').val();

        fetch('ws://zw.wechat.com:3000/api/login', {
            method: 'get',
            params: {
                user: name,
                pswd,
            }
        }).then(res => {
            console.log('res');
        });

        console.log('用户登录信息');
        return false;
    });

    this.$registerBox.find('form').submit(function(e) {
        e.preventDefault();
        console.log('注册用户信息');
        return false;
    });
}

$(function() {
    new Login();
});