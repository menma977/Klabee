package com.klabee

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.ProgressDialog
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.BitmapFactory
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.provider.MediaStore
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.klabee.controller.EmptyStupController
import com.klabee.model.EmptyStupQR
import net.gotev.uploadservice.MultipartUploadRequest
import org.json.JSONObject
import java.lang.Exception

class EmptyStup : AppCompatActivity() {

    private var locationManager : LocationManager? = null
    private var fileName : String = ""
    private var filePath : String = ""
    private var latitude : String = ""
    private var longitude : String = ""
    private var imageURI : Uri? = null

    @SuppressLint("SetTextI18n", "MissingPermission")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_empty_stup)
        doRequestPermission()

        EmptyStupQR.type = ""
        EmptyStupQR.oldQR = ""
        EmptyStupQR.newQR = ""

        val progressDialog  = ProgressDialog(this)
        progressDialog.setMessage("Loading...")
        progressDialog.setCancelable(false)

        val takeCamera = findViewById<Button>(R.id.TakeCamera)
        val qrOldStup = findViewById<Button>(R.id.QROldStup)
        val qrNewStup = findViewById<Button>(R.id.QRNewStup)
        val sendQRCode = findViewById<Button>(R.id.sendQRCode)

        val qROldStupEx = findViewById<TextView>(R.id.QROldStupEx)
        val qRNewStupEx = findViewById<TextView>(R.id.QRNewStupEx)

        locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        try {
            locationManager?.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0L, 0F, locationListener)
            sendQRCode.visibility = View.VISIBLE
        } catch(ex : Exception) {
            sendQRCode.visibility = View.INVISIBLE
        }

        if (EmptyStupQR.oldQR.isNotEmpty()) {
            qROldStupEx.text = "QR : ${EmptyStupQR.oldQR}"
        }

        if (EmptyStupQR.newQR.isNotEmpty()) {
            qRNewStupEx.text = "QR : ${EmptyStupQR.newQR}"
        }

        takeCamera.setOnClickListener {
            doRequestPermission()
            val values  = ContentValues()
            values.put(MediaStore.Images.Media.TITLE, "Stup")
            values.put(MediaStore.Images.Media.DESCRIPTION, "Stup Kosong")
            imageURI = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
            val callCameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            callCameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageURI)
            startActivityForResult(callCameraIntent,0)
        }

        qrOldStup.setOnClickListener {
            EmptyStupQR.type = "old"
            val goTo = Intent(this, QRCodeCamera::class.java)
            startActivity(goTo)
            finish()
        }

        qrNewStup.setOnClickListener {
            EmptyStupQR.type = "new"
            val goTo = Intent(this, QRCodeCamera::class.java)
            startActivity(goTo)
            finish()
        }

        sendQRCode.setOnClickListener {
            if (longitude.isNotEmpty() && latitude.isNotEmpty()) {
                progressDialog.show()
                val responseUploadImage = uploadImageToServer(filePath)
                if (responseUploadImage) {
                    val jsonObject = JSONObject("{fileName : '$fileName', longitude : '$longitude', latitude : '$latitude'}")
                    val emptyStupController = EmptyStupController().execute(jsonObject)
                    val response = emptyStupController.get()
                    if (response["Status"] == 0) {
                        EmptyStupQR.type = ""
                        EmptyStupQR.oldQR = ""
                        EmptyStupQR.newQR = ""
                        Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_LONG).show()
                    } else {
                        Toast.makeText(this, response["Pesan"].toString(), Toast.LENGTH_LONG).show()
                    }
                } else {
                    Toast.makeText(this, "Foto gagal di upload", Toast.LENGTH_LONG).show()
                }
                Handler().postDelayed({
                    progressDialog.dismiss()
                }, 5000)
            } else {
                Toast.makeText(this, "Lokasi anda tidak aktif tolong nyalakan untuk melanjutkan", Toast.LENGTH_LONG).show()
            }
        }
    }

    @SuppressLint("SimpleDateFormat")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val  camera = findViewById<ImageView>(R.id.Camera)
        if (resultCode == Activity.RESULT_OK) {
            try {
                filePath = getRealPathFromImageURI(imageURI)
                val convertArray = filePath.split("/").toTypedArray()
                fileName = convertArray.last()
                val thumbnails = MediaStore.Images.Media.getBitmap(contentResolver, imageURI)
                camera.setImageBitmap(thumbnails)
            } catch (ex : Exception) {
                Toast.makeText(this, "Ada Kesalah saat mengambil gambar", Toast.LENGTH_LONG).show()
            }
        } else {
            Toast.makeText(this, "Anda belum mengisi gambar dokumentasi", Toast.LENGTH_LONG).show()
        }
    }

    private fun getRealPathFromImageURI(contentUri : Uri?) : String {
        val data : Array<String> = Array(100){MediaStore.Images.Media.DATA}
        val cursor = managedQuery(contentUri, data, null, null, null)
        val columnIndex = cursor.getColumnIndex(MediaStore.Images.Media.DATA)
        cursor.moveToFirst()
        return cursor.getString(columnIndex)
    }

    private fun uploadImageToServer(getFile:String) : Boolean {
        return try {
            MultipartUploadRequest(this, "http://picotele.com/neomitra/javacoin/klabee.php")
                .addFileToUpload(getFile, "file")
                //.addParameter("parameter", "content parameter")
                .setMaxRetries(2)
                .startUpload()

            true
        }catch (ex : Exception) {
            ex.printStackTrace()
            false
        }
    }

    //define location the listener
    private val locationListener: LocationListener = object : LocationListener {
        override fun onLocationChanged(location: Location) {
            longitude = location.longitude.toString()
            latitude = location.latitude.toString()
        }
        override fun onStatusChanged(provider: String, status: Int, extras: Bundle) {}
        override fun onProviderEnabled(provider: String) {}
        override fun onProviderDisabled(provider: String) {}
    }

    @SuppressLint("InlinedApi")
    private fun doRequestPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.CAMERA), 100)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION), 100)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 100)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
            != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), 100)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)
            != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE), 100)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.FOREGROUND_SERVICE)
            != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.FOREGROUND_SERVICE), 100)
        }
    }
}
