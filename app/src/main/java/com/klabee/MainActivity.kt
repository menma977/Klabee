package com.klabee

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.klabee.controller.LoginController
import com.klabee.controller.ProgressBarController
import com.klabee.model.User
import com.klabee.model.UserSession
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val progressBarController = ProgressBarController(this)
        val userSession = UserSession(this)
        progressBarController.openDialog()

        if (userSession.getString("username").toString().isNotEmpty() && userSession.getString("password").toString().isNotEmpty()) {
            User.username = userSession.getString("username").toString()
            User.password = userSession.getString("password").toString()
            if (User.username.isNotEmpty()) {
                val loginController = LoginController().execute()
                val response = loginController.get()
                if (response["Status"].toString() =="0") {
                    val goTo = Intent(this, BottomNavigation::class.java)
                    startActivity(goTo)
                    finish()
                } else {
                    progressBarController.closeDialog()
                    Toast.makeText(this, "Sesi login anda telah habis", Toast.LENGTH_LONG).show()
                }
            }
        }

        progressBarController.closeDialog()

        Password.setOnClickListener {
            progressBarController.openDialog()
            User.username = Username.text.toString()
            User.password = Password.text.toString()
            val loginController = LoginController().execute()
            val response = loginController.get()
            if (response["Status"].toString() == "1") {
                Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_SHORT).show()
                progressBarController.closeDialog()
            } else {
                progressBarController.closeDialog()
                userSession.saveString("username", User.username)
                userSession.saveString("password", User.password)
                val goTo = Intent(this, BottomNavigation::class.java)
                startActivity(goTo)
                finish()
            }
        }

        Login.setOnClickListener {
            progressBarController.openDialog()
            User.username = Username.text.toString()
            User.password = Password.text.toString()
            val loginController = LoginController().execute()
            val response = loginController.get()
            if (response["Status"].toString() == "1") {
                Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_SHORT).show()
                progressBarController.closeDialog()
            } else {
                progressBarController.closeDialog()
                userSession.saveString("username", User.username)
                userSession.saveString("password", User.password)
                val goTo = Intent(this, BottomNavigation::class.java)
                startActivity(goTo)
                finish()
            }
        }
    }
}
