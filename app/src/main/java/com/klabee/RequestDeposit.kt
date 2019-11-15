package com.klabee

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.klabee.controller.RequestDepostiController
import com.klabee.model.User

class RequestDeposit : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_request_deposit)

        val send = findViewById<Button>(R.id.Send)

        send.setOnClickListener {
            val username = User.username
            val total = findViewById<EditText>(R.id.Total)
            val requestDepositController = RequestDepostiController(username, total.text.toString()).execute()
            val response = requestDepositController.get()
            if (response["Status"].toString() == "0") {
                Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_LONG).show()
                total.setText("")
            } else {
                Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_LONG).show()
            }
        }
    }
}
