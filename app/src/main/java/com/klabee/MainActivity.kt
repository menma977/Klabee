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

        doRequestPermission()

        if (userSession.getString("username").toString().isNotEmpty() && userSession.getString("password").toString().isNotEmpty()) {
            User.username = userSession.getString("username").toString()
            User.password = userSession.getString("password").toString()
            if (User.username.isNotEmpty()) {
                val loginController = LoginController().execute()
                val response = loginController.get()
                if (response["Status"].toString() == "0") {
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

    @SuppressLint("InlinedApi")
    private fun doRequestPermission() {
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) != PackageManager.PERMISSION_GRANTED
            || ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
            || ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
            || ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) != PackageManager.PERMISSION_GRANTED
            || ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.READ_EXTERNAL_STORAGE
            ) != PackageManager.PERMISSION_GRANTED
            || ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.FOREGROUND_SERVICE
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissions(
                arrayOf(
                    Manifest.permission.CAMERA,
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.FOREGROUND_SERVICE
                ), 100
            )
        }
    }
}
