package com.klabee

import android.annotation.SuppressLint
import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.klabee.controller.ProgressBarController
import com.klabee.model.User
import com.klabee.model.UserSession

class BottomNavigation : AppCompatActivity() {

    private val onNavigationItemSelectedListener = BottomNavigationView.OnNavigationItemSelectedListener { item ->
        when (item.itemId) {
            R.id.navigation_home -> {
                val fragment = Home()
                addFragment(fragment)
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_dashboard -> {
                val fragment = Menu()
                addFragment(fragment)
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_logout -> {
                val userSession = UserSession(this)
                userSession.saveString("username", "")
                userSession.saveString("password", "")
                User.username = ""
                User.password = ""
                User.balance = ""
                User.balanceBonus = ""
                val goTo = Intent(this, MainActivity::class.java)
                startActivity(goTo)
                finish()
                return@OnNavigationItemSelectedListener true
            }
        }
        false
    }

    @SuppressLint("PrivateResource")
    private fun addFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .setCustomAnimations(R.anim.design_bottom_sheet_slide_in, R.anim.design_bottom_sheet_slide_out)
            .replace(R.id.contentFragment, fragment, fragment.javaClass.simpleName).commit()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_bottom_navigation)

        val navView: BottomNavigationView = findViewById(R.id.nav_view)
        navView.setOnNavigationItemSelectedListener(onNavigationItemSelectedListener)

        val fragment = Home()
        addFragment(fragment)

        val userSession = UserSession(this)
        if (userSession.getString("username").isNullOrEmpty() || userSession.getString("password").isNullOrEmpty() ) {
            userSession.saveString("username", "")
            userSession.saveString("password", "")
            User.username = ""
            User.password = ""
            User.balance = ""
            User.balanceBonus = ""
            val goTo = Intent(this, MainActivity::class.java)
            startActivity(goTo)
            finish()
        }
    }
}
