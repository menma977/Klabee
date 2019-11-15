package com.klabee

import android.Manifest
import android.app.ProgressDialog
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.google.zxing.Result
import com.klabee.controller.BalanceController
import com.klabee.controller.BuyBackController
import com.klabee.controller.ProgressBarController
import com.klabee.model.User
import com.klabee.model.UserSession
import kotlinx.android.synthetic.main.activity_check_stup.*
import me.dm7.barcodescanner.zxing.ZXingScannerView
import org.json.JSONObject
import java.text.NumberFormat
import java.util.*

class BuyBack : AppCompatActivity(), ZXingScannerView.ResultHandler {

    private lateinit var mScannerView: ZXingScannerView

    private var progressBarController : ProgressBarController? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_buy_back)

        progressBarController = ProgressBarController(this)

        progressBarController!!.openDialog()

        initScannerView()

        progressBarController!!.closeDialog()

        val bonus = findViewById<TextView>(R.id.Bonus)
        val qrCode = findViewById<TextView>(R.id.QRCode)

        val sendQRButton = findViewById<Button>(R.id.sendQRCode)

        val localIDR = Locale("in", "ID")
        val numberFormat = NumberFormat.getCurrencyInstance(localIDR)
        bonus.text = numberFormat.format(if(User.balanceBonus.isNotEmpty()) User.balanceBonus.toBigInteger() else 0)

        sendQRButton.setOnClickListener {
            progressBarController!!.openDialog()
            val getQRCode = qrCode.text
            val compriseJson = JSONObject()
            compriseJson.put("code", getQRCode)
            val buybackController = BuyBackController().execute(compriseJson)
            val response = buybackController.get()
            if (response["Status"] == "0") {
                getBalance()
                Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_LONG).show()
                bonus.text = numberFormat.format(if(User.balanceBonus.isNotEmpty()) User.balanceBonus.toBigInteger() else 0)
            } else {
                Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_LONG).show()
            }
            progressBarController!!.closeDialog()
        }
    }

    override fun handleResult(p0: Result?) {
        if (p0?.text.toString().isNotEmpty()) {
            val qrCode = findViewById<TextView>(R.id.QRCode)
            qrCode.text = p0?.text.toString()
        }
    }

    override fun onStart() {
        mScannerView.startCamera()
        doRequestPermission()
        super.onStart()
    }

    override fun onPause() {
        mScannerView.stopCamera()
        super.onPause()
    }

    private fun initScannerView() {
        doRequestPermission()
        mScannerView = ZXingScannerView(this)
        mScannerView.setAutoFocus(true)
        mScannerView.setResultHandler(this)
        QRCamera.addView(mScannerView)
    }

    private fun doRequestPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.CAMERA), 100)
        }
    }

    private fun getBalance() {
        progressBarController!!.openDialog()
        val balanceController = BalanceController().execute()
        val response = balanceController.get()
        if (response["Status"] == "0") {
            User.balance = response["Saldo"].toString()
            User.balanceBonus = response["Saldobon"].toString()

            val bonus = findViewById<TextView>(R.id.Bonus)
            val localIDR = Locale("in", "ID")
            val numberFormat = NumberFormat.getCurrencyInstance(localIDR)
            bonus.text = numberFormat.format(if(User.balanceBonus.isNotEmpty()) User.balanceBonus.toBigInteger() else 0)
        }
        progressBarController!!.closeDialog()
    }
}
