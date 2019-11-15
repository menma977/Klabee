package com.klabee

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.EditText
import android.widget.Toast
import com.klabee.controller.SaveUserController
import kotlinx.android.synthetic.main.activity_add_client.*
import org.json.JSONObject

class AddClient : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_client)

        val numberBank = findViewById<EditText>(R.id.NumberBank)

        numberBank.setOnClickListener {
            addUser()
        }

        Register.setOnClickListener {
            addUser()
        }
    }

    private fun addUser() {
        val name = findViewById<EditText>(R.id.Name)
        val username = findViewById<EditText>(R.id.Username)
        val password = findViewById<EditText>(R.id.Password)
        val passwordConfirmation = findViewById<EditText>(R.id.PasswordConfirmation)
        val address = findViewById<EditText>(R.id.Address)
        val email = findViewById<EditText>(R.id.Email)
        val phone = findViewById<EditText>(R.id.Phone)
        val bank = findViewById<EditText>(R.id.Bank)
        val numberBank = findViewById<EditText>(R.id.NumberBank)

        if (name.text.toString().isEmpty() && name.text.toString().isBlank()) {
            Toast.makeText(this, "Nama tidak boleh kosong", Toast.LENGTH_LONG).show()
            name.requestFocus()
        } else if (username.text.toString().isEmpty() && username.text.toString().isBlank()) {
            Toast.makeText(this, "Username tidak boleh kosong", Toast.LENGTH_LONG).show()
            username.requestFocus()
        } else if (password.text.toString().isEmpty() && password.text.toString().isBlank()) {
            if (password.text.toString() != passwordConfirmation.toString()) {
                Toast.makeText(this, "Password tidak cocok dengan Password Confirmasi", Toast.LENGTH_LONG).show()
                passwordConfirmation.requestFocus()
            } else {
                Toast.makeText(this, "Password tidak boleh kosong", Toast.LENGTH_LONG).show()
                password.requestFocus()
            }
        } else if (address.text.toString().isEmpty() && address.text.toString().isBlank()) {
            Toast.makeText(this, "Alamat lekap tidak boleh kosong", Toast.LENGTH_LONG).show()
            address.requestFocus()
        } else if (email.text.toString().isEmpty() && address.text.toString().isBlank()) {
            Toast.makeText(this, "Email tidak boleh kosong", Toast.LENGTH_LONG).show()
            email.requestFocus()
        } else if (phone.text.toString().isEmpty() && phone.text.toString().isBlank()) {
            Toast.makeText(this, "No HP tidak boleh kosong", Toast.LENGTH_LONG).show()
            phone.requestFocus()
        } else if (bank.text.toString().isEmpty() && bank.text.toString().isBlank()) {
            Toast.makeText(this, "Bank tidak boleh kosong", Toast.LENGTH_LONG).show()
            bank.requestFocus()
        } else if (numberBank.text.toString().isEmpty() && numberBank.text.isBlank()) {
            Toast.makeText(this, "Nomor Rekening tidak boleh kosong", Toast.LENGTH_LONG).show()
            numberBank.requestFocus()
        } else {
            val converter = JSONObject()
            converter.put("username", username.text.toString())
            converter.put("password", password.text.toString())
            converter.put("address", address.text.toString())
            converter.put("email", email.text.toString())
            converter.put("phone", phone.text.toString())
            converter.put("bank", bank.text.toString())
            converter.put("numberBank", numberBank.text.toString())
            converter.put("name", name.text.toString())
            val saveUserController = SaveUserController().execute(converter)
            val response = saveUserController.get()
            if (response["Status"].toString() == "1") {
                Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_LONG).show()
            } else {
                name.setText("")
                username.setText("")
                password.setText("")
                passwordConfirmation.setText("")
                address.setText("")
                email.setText("")
                phone.setText("")
                bank.setText("")
                numberBank.setText("")
                Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_LONG).show()
            }
        }
    }
}
