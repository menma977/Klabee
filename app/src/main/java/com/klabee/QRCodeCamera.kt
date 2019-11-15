package com.klabee

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.FrameLayout
import androidx.core.content.ContextCompat
import com.google.zxing.Result
import com.klabee.model.EmptyStupQR
import me.dm7.barcodescanner.zxing.ZXingScannerView

class QRCodeCamera : AppCompatActivity(), ZXingScannerView.ResultHandler {

    private lateinit var mScannerView: ZXingScannerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_qrcode_camera)
        initScannerView()
    }

    override fun handleResult(p0: Result?) {
        if (p0?.text.toString().isNotEmpty()) {
            if (EmptyStupQR.type == "old") {
                EmptyStupQR.oldQR = p0?.text.toString()
            } else {
                EmptyStupQR.newQR = p0?.text.toString()
            }
            val goTo = Intent(this, EmptyStup::class.java)
            startActivity(goTo)
            finish()
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

    override fun onBackPressed() {
        super.onBackPressed()
        val goTo = Intent(this, EmptyStup::class.java)
        startActivity(goTo)
        finish()
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
        val getQRCodeCamera = findViewById<FrameLayout>(R.id.QRCodeCamera)
        getQRCodeCamera.addView(mScannerView)
    }
}
