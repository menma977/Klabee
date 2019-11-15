package com.klabee

import android.Manifest
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.google.zxing.Result
import com.klabee.controller.CheckStupController
import com.klabee.controller.ProgressBarController
import kotlinx.android.synthetic.main.activity_check_stup.*
import me.dm7.barcodescanner.zxing.ZXingScannerView

class CheckStup : AppCompatActivity(), ZXingScannerView.ResultHandler {

    private lateinit var mScannerView: ZXingScannerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_check_stup)

        initScannerView()

        Reset.setOnClickListener {
            initScannerView()
            mScannerView.resumeCameraPreview(this)
        }
    }

    override fun handleResult(p0: Result?) {
        if (p0?.text.toString().isNotEmpty()) {
            checkQRCode(p0?.text.toString())
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

    private fun doRequestPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.CAMERA), 100)
        }
    }

    private fun initScannerView() {
        doRequestPermission()
        mScannerView = ZXingScannerView(this)
        mScannerView.setAutoFocus(true)
        mScannerView.setResultHandler(this)
        QRCamera.addView(mScannerView)
    }

    private fun checkQRCode(code : String) {
        val agent = findViewById<TextView>(R.id.Agent)
        val name = findViewById<TextView>(R.id.Name)
        val usernameAgent = findViewById<TextView>(R.id.UsernameAgent)
        val oneStMonth = findViewById<TextView>(R.id.OneStMonth)
        val towStMonth = findViewById<TextView>(R.id.TowStMonth)
        val treeStMonth = findViewById<TextView>(R.id.TreeStMonth)
        val checkStupController = CheckStupController().execute(code)
        val result = checkStupController.get()
        if (result["Status"] == 0) {
            agent.text = result["Agen"].toString()
            name.text = result["Name"].toString()
            usernameAgent.text = result["Username"].toString()
            oneStMonth.text = result["Bln1"].toString()
            towStMonth.text = result["Bln2"].toString()
            treeStMonth.text = result["Bln3"].toString()
        } else {
            agent.text = ""
            name.text = ""
            usernameAgent.text = ""
            oneStMonth.text = ""
            towStMonth.text = ""
            treeStMonth.text = ""
            Toast.makeText(this, result["Pesan"].toString(), Toast.LENGTH_LONG).show()
        }
    }
}
