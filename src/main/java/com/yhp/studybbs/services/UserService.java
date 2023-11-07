package com.yhp.studybbs.services;

import com.yhp.studybbs.entities.EmailAuthEntity;
import com.yhp.studybbs.mappers.UserMapper;
import com.yhp.studybbs.regexes.UserRegex;
import com.yhp.studybbs.results.user.SendRegisterEmailResult;
import com.yhp.studybbs.utils.CryptoUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserService {
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public SendRegisterEmailResult sendRegisterEmailResult(String email){
        if (!UserRegex.EMAIL.matches(email)){
            return SendRegisterEmailResult.FAILURE;
        }
        if (this.userMapper.selectUserByEmail(email) != null){ // userMapper의selectUserByEmail의 email이 null이 아닌경우
            return SendRegisterEmailResult.FAILURE_DUPLICATE_EMAIL; //
        }
        EmailAuthEntity emailAuth = new EmailAuthEntity();
        emailAuth.setCode(RandomStringUtils.randomNumeric(6));
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                email,
                emailAuth.getCode(),
                Math.random(),
                Math.random()));
        emailAuth.setVerified(false);
        emailAuth.setCreatedAt(new Date());
        emailAuth.setExpiresAt(DateUtils.addMinutes(emailAuth.getCreatedAt(), 5));
        String code = RandomStringUtils.randomNumeric(6); // 6자 숫자 코드 랜덤생성

        return SendRegisterEmailResult.SUCCESS;
    }
}
