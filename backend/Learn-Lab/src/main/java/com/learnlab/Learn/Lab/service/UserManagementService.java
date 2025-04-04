package com.learnlab.Learn.Lab.service;



import com.learnlab.Learn.Lab.dto.ReqRes;
import com.learnlab.Learn.Lab.entity.OurUsers;
import com.learnlab.Learn.Lab.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UserManagementService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ReqRes register(ReqRes registrationRequest){
        ReqRes resp = new ReqRes();

        try {
            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setAge(registrationRequest.getAge());
            ourUser.setGender(registrationRequest.getGender());
            ourUser.setName(registrationRequest.getName());
            ourUser.setRole(registrationRequest.getRole());
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            OurUsers ourUsersResult = usersRepo.save(ourUser);

            if (ourUsersResult.getId() > 0){
                resp.setOurUsers((ourUsersResult));
                resp.setMessage("User seved succesfully");
                resp.setStatusCode(200);
            }

        }catch (Exception e){

            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }

        return resp;
    }

    public ReqRes login(ReqRes loginRequest){
        ReqRes response = new ReqRes();

        try{

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));
            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(),user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setAge(user.getAge());
            response.setGender(user.getGender());
            response.setMessage("login successfull");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    public ReqRes refreshToken(ReqRes refreshTokenReqiest){
        ReqRes response = new ReqRes();

        try{
            String ourEmail = jwtUtils.extractUserName(refreshTokenReqiest.getToken());
            OurUsers users = usersRepo.findByEmail(ourEmail).orElseThrow();

            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(),users)){
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hrs");
                response.setMessage("Successfull refresh token");
            }

            response.setStatusCode(200);
            return response;
        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return  response;
        }
    }

    public ReqRes getAllUsers(){
        ReqRes reqRes = new ReqRes();

        try{
            List<OurUsers> result = usersRepo.findAll();

            if (!result.isEmpty()){
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            }else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No user found");
            }

            return reqRes;
        }catch (Exception e){

            reqRes.setStatusCode(500);
            reqRes.setMessage("Error ocured" + e.getMessage());
            return reqRes;
        }
    }

    public ReqRes getUsersById(Integer id){
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers usersById = usersRepo.findById(id).orElseThrow(()->new RuntimeException("User Not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users id'" + id +"'found successfully");
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occured" + e.getMessage());
        }

        return reqRes;
    }

    public ReqRes deleteUser(Integer userId){
        ReqRes reqRes = new ReqRes();

        try {
            Optional<OurUsers>usersOptional = usersRepo.findById(userId);
            if (usersOptional.isPresent()){
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted succesfully");
            }else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found deletion");
            }
        }catch (Exception e){
            reqRes.setStatusCode(404);
            reqRes.setMessage("Error occured while deleting user" + e.getMessage());

        }

        return reqRes;
    }

    public ReqRes updateUser(Integer userId,OurUsers updateUser){
        ReqRes reqRes = new ReqRes();

        try{
            Optional<OurUsers>usersOptional = usersRepo.findById(userId);

            if (usersOptional.isPresent()){
                OurUsers existingUser = usersOptional.get();
                existingUser.setEmail(updateUser.getEmail());
                existingUser.setName(updateUser.getName());
                existingUser.setAge(updateUser.getAge());
                existingUser.setRole(updateUser.getRole());
                existingUser.setGender(updateUser.getGender());

                if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()){
                    existingUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User Updated successfully");


            }else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found updated");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occured while updating user:" + e.getMessage());
        }

        return reqRes;
    }

    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();

        try {
            Optional<OurUsers>usersOptional = usersRepo.findByEmail(email);

            if (usersOptional.isPresent()){
                reqRes.setOurUsers(usersOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successfull");
            }else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Not found info");
            }
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occured while getting user Info:"+ e.getMessage());
        }

        return reqRes;
    }

}

