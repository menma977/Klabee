package com.klabee

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.FragmentActivity
import com.klabee.controller.BalanceController
import com.klabee.controller.ProgressBarController
import com.klabee.controller.ProgressBarFragmentController
import com.klabee.model.User
import java.text.NumberFormat
import java.util.*


class Home : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        val view: View = inflater.inflate(R.layout.fragment_home, container, false)

        val progressBarController = ProgressBarFragmentController(activity!!)
        progressBarController.openDialog()

        val localIDR = Locale("in", "ID")
        val numberFormat = NumberFormat.getCurrencyInstance(localIDR)
        var goTo : Intent

        val reloadButton = view.findViewById<Button>(R.id.Reload)
        val checkStup = view.findViewById<Button>(R.id.CheckStup)
        val sealBroken = view.findViewById<Button>(R.id.SealBroken)
        val emptyStup = view.findViewById<Button>(R.id.EmptyStup)
        val buyBack = view.findViewById<Button>(R.id.BuyBack)
        val sendBee = view.findViewById<Button>(R.id.SendBee)

        val username = view.findViewById<TextView>(R.id.UsernameAccount)
        val balance = view.findViewById<TextView>(R.id.Balance)
        val balanceBonus = view.findViewById<TextView>(R.id.BalanceBonus)

        username.text = User.username
        getBalance(numberFormat, balance, balanceBonus)
        progressBarController.closeDialog()

        reloadButton.setOnClickListener {
            progressBarController.openDialog()
            getBalance(numberFormat, balance, balanceBonus)
            progressBarController.closeDialog()
        }

        checkStup.setOnClickListener{
            goTo = Intent(activity, CheckStup::class.java)
            startActivity(goTo)
        }

        sealBroken.setOnClickListener{
            goTo = Intent(activity, SealBroken::class.java)
            startActivity(goTo)
        }

        emptyStup.setOnClickListener{
            goTo = Intent(activity, EmptyStup::class.java)
            startActivity(goTo)
        }

        buyBack.setOnClickListener {
            goTo = Intent(activity, BuyBack::class.java)
            startActivity(goTo)
        }

        sendBee.setOnClickListener {
            goTo = Intent(activity, SendBee::class.java)
            startActivity(goTo)
        }

        return view
    }

    private fun getBalance(numberFormat: NumberFormat, balance: TextView, balanceBonus: TextView) {
        val balanceController = BalanceController().execute()
        val response = balanceController.get()
        if (response["Status"] == "0") {
            val balanceOBJ : String = if (response["Saldo"].toString().isNotEmpty()) {
                response["Saldo"].toString()
            } else {
                "0"
            }
            val balanceBonusOBJ : String = if (response["Saldobon"].toString().isNotEmpty()) {
                response["Saldobon"].toString()
            } else {
                "0"
            }
            balance.text = numberFormat.format(balanceOBJ.toBigInteger())
            balanceBonus.text = numberFormat.format(balanceBonusOBJ.toBigInteger())
            User.balance = response["Saldo"].toString()
            User.balanceBonus = response["Saldobon"].toString()
        } else {
            balance.text = numberFormat.format(0)
            balanceBonus.text = numberFormat.format(0)
            User.balance = "0"
            User.balanceBonus = "0"
            Toast.makeText(activity, "Gagal terkonkesi ke internet mohon ulangi lagi", Toast.LENGTH_LONG).show()
        }
    }
}