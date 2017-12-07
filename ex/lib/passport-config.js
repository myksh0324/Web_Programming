const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, done);
  });

  passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (user && await user.validatePassword(password)) {
        return done(null, user, req.flash('success', 'Welcome!'));
      }
      return done(null, false, req.flash('danger', 'Invalid email or password'));
    } catch (err) {
      done(err);
    }
  }));

  // facebook 로그인 기능 //차후 Heroku에 deploy시 주소 수정요함
  //현재는 dev모드여서 Public하게 사용하기 위해서는 App Review요청을 해야함
  passport.use(new FacebookStrategy({
    clientID: '1783743164971161',
    clientSecret: 'd0f5857dc4197db8bec4f4cc5bffcb05',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields : ['email', 'name', 'picture']
  }, async (token, refreshToken, profile, done) => {
    console.log('Facebook', profile); // facebook에서 넘어오는 profile 정보
    try {
      var email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : '';
      var picture = (profile.photos && profile.photos[0]) ? profile.photos[0].value : '';
      var name = (profile.displayName) ? profile.displayName :
        [profile.name.givenName, profile.name.middleName, profile.name.familyName]
          .filter(e => e).join(' ');
      console.log(email, picture, name, profile.name);
      // 같은 facebook id를 가진 사용자가 있나?
      var user = await User.findOne({ 'facebook.id': profile.id });
      if (!user) {
        // 없다면, 혹시 같은 email이라도 가진 사용자가 있나?
        if (email) {
          user = await User.findOne({ email: email });
        }
        if (!user) {
          // 그것도 없다면 새로 만들어야지.
          user = new User({ name: name });
          user.email = email ? email : `__unknown-${user._id}@no-email.com`;
        }
        // facebook id가 없는 사용자는 해당 id를 등록
        user.facebook.id = profile.id;
        user.facebook.photo = picture;
      }
      user.facebook.token = profile.token;
      await user.save();
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }));

  //kakao로그인 기능
  passport.use(new KakaoStrategy({
    clientID: 'dd1601044df8b85979edbff9bcac72ce',
    clientSecret: '1Th1jJPldi312eIJxYL8SeF6Nz2bPzhX',
    callbackURL: 'http://localhost:3000/auth/kakao/callback',
  }, async (token, refreshToken, profile, done) => {
    console.log('kakao', profile); // kakao에서 넘어오는 profile 정보
    try {
      var email = profile._json.kaccount_email;
      var picture = profile._json.properties.profile_image;
      var name = (profile.displayName) ? profile.displayName :
        [profile.name.givenName, profile.name.middleName, profile.name.familyName]
          .filter(e => e).join(' ');
      console.log(email, picture, name);
      // 같은 kakao id를 가진 사용자가 있나?
      var user = await User.findOne({ 'kakao.id': profile.id });
      if (!user) {
        // 없다면, 혹시 같은 email이라도 가진 사용자가 있나?
        if (email) {
          user = await User.findOne({ email: email });
        }
        if (!user) {
          // 그것도 없다면 새로 만들어야지.
          user = new User({ name: name });
          user.email = email;
        }
        user.kakao.id = profile.id;
        user.kakao.photo = picture;
      }
      user.kakao.token = profile.token;
      user.kakao.photo = picture;
      
      console.log(user.kakao.photo+"이것이 사진");
      
      await user.save();
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }
  ));

};
