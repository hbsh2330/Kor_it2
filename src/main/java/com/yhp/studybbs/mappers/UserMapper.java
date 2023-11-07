package com.yhp.studybbs.mappers;

import com.yhp.studybbs.entities.EmailAuthEntity;
import com.yhp.studybbs.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    int insertEmailAuth(EmailAuthEntity emailAuth);
    UserEntity selectUserByEmail(@Param(value = "email") String email);

}
