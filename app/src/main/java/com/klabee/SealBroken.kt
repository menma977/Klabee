package com.klabee

import android.Manifest
import android.app.ProgressDialog
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.google.zxing.Result
import com.klabee.controller.CheckStupController
import com.klabee.controller.ProgressBarController
import com.klabee.controller.SealBrokenController
import kotlinx.android.synthetic.main.activity_check_stup.*
import me.dm7.barcodescanner.zxing.ZXingScannerView

class SealBroken : AppCompatActivity(), ZXingScannerView.ResultHandler {

    private lateinit var mScannerView: ZXingScannerView

    private var progressBarController : ProgressBarController? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_seal_broken)

        progressBarController = ProgressBarController(this)

        progressBarController!!.openDialog()

        initScannerView()

        progressBarController!!.closeDialog()

        val sendQRCode = findViewById<Button>(R.id.SendQRCode)

        sendQRCode.setOnClickListener{
            progressBarController!!.openDialog()
            checkQRCode()
            progressBarController!!.closeDialog()
        }
    }

    override fun handleResult(p0: Result?) {
        if (p0?.text.toString().isNotEmpty()) {
            val qRCode = findViewById<TextView>(R.id.QRCode)
            qRCode.text = p0?.text.toString()
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

    private fun checkQRCode() {
        val progressDialog = ProgressDialog(this)
        progressDialog.setMessage("Loading...")
        progressDialog.setCancelable(false)
        progressDialog.show()
        val qRCode = findViewById<TextView>(R.id.QRCode)
        val sealBrokenController = SealBrokenController().execute(qRCode.toString())
        val result = sealBrokenController.get()
        if (result["Status"] == 0) {
            Toast.makeText(this, result["Pesan"].toString(), Toast.LENGTH_LONG).show()
        } else {
            Toast.makeText(this, result["Pesan"].toString(), Toast.LENGTH_LONG).show()
        }
        mScannerView.resumeCameraPreview(this)
        progressDialog.dismiss()
    }
}
