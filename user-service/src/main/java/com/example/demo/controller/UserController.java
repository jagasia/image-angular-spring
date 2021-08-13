package com.example.demo.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.annotation.MultipartConfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "https://*","*"})
@MultipartConfig
public class UserController {
	
	private static final Logger log = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
	private UserService us;
	
//	@PostMapping("/user")
	@RequestMapping(method = RequestMethod.POST, value = "/user", consumes = "text/json", produces = MediaType.APPLICATION_JSON_VALUE)
	public User signup(@RequestBody User user) throws NoSuchAlgorithmException {
		//lets 
		String encryptedPassword = encryptSha1(user.getPassword());
		user.setPassword(encryptedPassword);
		return us.create(user);
	}
	
	@PostMapping("/user/pic")
	public User signuppic(@RequestParam("username") String username, @RequestParam String password, @RequestParam String firstName,@RequestParam String lastName,@RequestParam String dateOfBirth,@RequestParam String email, @RequestParam("pic") MultipartFile file) throws IOException, ParseException
	{
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		User user=new User(username, password, firstName, lastName, sdf.parse(dateOfBirth), email, file.getBytes());
		//before we try to store user object, lets see
		System.out.println(user);
		System.out.println(user.getPic().length);
		return us.create(user);
	}
	
	@GetMapping("/user")
	public List<User> getAllUsers() {
		return us.read();
	}
	
	@GetMapping("/user/{username}")
	public User findUserByUsername(@PathVariable String username)
	{
		return us.read(username);
	}
	@PostMapping("/user/{uname}/{password}")
	public User validateLogin(@PathVariable("uname") String username, @PathVariable String password) throws NoSuchAlgorithmException {
		User user = us.read(username);
		if(user!=null)
		{
			log.warn("The user is not null");
			//check if the password is correct
			if(!user.getPassword().equals(encryptSha1(password)))
			{
				log.warn("Password is incorrect");
				user=null;
			}
		}
		log.warn("Last line of validate Login");
		return user;
	}
	@PutMapping("/user")
	public User updateUser(@RequestBody User user) throws NoSuchAlgorithmException{
		String encryptedPassword = encryptSha1(user.getPassword());
		user.setPassword(encryptedPassword);
//		Thread.sleep(10000);
		return us.update(user);
	}
	@DeleteMapping("/user/{username}")
	public boolean removeUser(@PathVariable String username) {
		return us.delete(username);
	}
	
	@GetMapping("/user/otp/{username}")
	public String generateOtp(@PathVariable String username)
	{
		System.out.println("username: "+username);
		int x = (int) (Math.random()*1000000);
		String email="";
		//lets find the email of the user
		User user = us.read(username);
		if(user==null)
		{
			System.out.println("Invalid user");
			return "invalid user";
		}else
		{
			System.out.println();
			email=user.getEmail();
		}
		sendEmail(email, x+"");
		return x+"";
	}
	
	private void sendEmail(String to, String otp)
	{
		 Properties props = new Properties();
	        props.put("mail.smtp.host", "true");
	        props.put("mail.smtp.starttls.enable", "true");
	        props.put("mail.smtp.host", "smtp.gmail.com");
	        props.put("mail.smtp.port", "587");
	        props.put("mail.smtp.auth", "true");
	        //Establishing a session with required user details
	        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
	            protected PasswordAuthentication getPasswordAuthentication() {
	                return new PasswordAuthentication("jag.javaprogram@gmail.com", "P@$$w0rd@123");
	            }
	        });
	        try {
	            //Creating a Message object to set the email content
	            MimeMessage msg = new MimeMessage(session);
	            //Storing the comma seperated values to email addresses
//	            String to = "rjagadeeswaran@yahoo.com";
	            /*Parsing the String with defualt delimiter as a comma by marking the boolean as true and storing the email
	            addresses in an array of InternetAddress objects*/
	            InternetAddress[] address = InternetAddress.parse(to, true);
	            //Setting the recepients from the address variable
	            msg.setRecipients(Message.RecipientType.TO, address);
	            String timeStamp = new SimpleDateFormat("yyyymmdd_hh-mm-ss").format(new Date());
	            msg.setSubject("Sample Mail : " + timeStamp);
	            msg.setSentDate(new Date());
	            msg.setText(otp+" is the otp for changing your password. If you have not initiated this, report us at abcd@efgh.com");
	            msg.setHeader("XPriority", "1");
	           
	            Transport.send(msg);
	            System.out.println("Mail has been sent successfully");
	        } catch (MessagingException mex) {
	            System.out.println("Unable to send an email:\n" + mex);
	        }
	}

	
private String encryptSha1(String password) throws NoSuchAlgorithmException
{
	//String password = "123456";
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hashInBytes = md.digest(password.getBytes(StandardCharsets.UTF_8));
		// bytes to hex
        StringBuilder sb = new StringBuilder();
        for (byte b : hashInBytes) {
            sb.append(String.format("%02x", b));
        }
        //System.out.println(sb.toString());
	return sb.toString();
}
}
