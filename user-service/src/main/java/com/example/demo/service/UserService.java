package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository ur;
	
	public User create(User user) {
		return ur.save(user);
	}
	public List<User> read() {
		return ur.findAll();
	}
	public User read(String username) {
		Optional<User> x = ur.findById(username);
		User user=null;
		if(x.isPresent())
		{
			user=x.get();
		}
		return user;
	}
	public User update(User user) {
		return ur.save(user);
	}
	public boolean delete(String username) {
		ur.delete(read(username));
		User user = read(username);
		boolean status=false;
		if(user==null)
		{
			status=true;
		}
		return status;
	}
	
}
