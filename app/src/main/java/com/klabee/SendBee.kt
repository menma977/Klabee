package com.klabee

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.provider.MediaStore
import android.widget.*
import com.google.zxing.Result
import com.klabee.controller.*
import com.klabee.model.User
import kotlinx.android.synthetic.main.activity_send_bee.*
import me.dm7.barcodescanner.zxing.ZXingScannerView
import net.gotev.uploadservice.MultipartUploadRequest
import org.json.JSONObject
import java.lang.Exception
import java.text.NumberFormat
import java.util.*
import kotlin.collections.ArrayList
import kotlin.concurrent.schedule

class SendBee : AppCompatActivity(), ZXingScannerView.ResultHandler {

    private lateinit var mScannerView: ZXingScannerView
    private val arrayListQR: ArrayList<String> = ArrayList()
    private val arrayListQRDump: ArrayList<String> = ArrayList()
    private val arrayListUser: ArrayList<String> = ArrayList()
    private var locationManager: LocationManager? = null
    private lateinit var codeQRList: LinearLayout
    private var fileName: String = ""
    private var filePath: String = ""
    private var latitude: String = ""
    private var longitude: String = ""
    private var imageURI: Uri? = null

    @SuppressLint("MissingPermission")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_send_bee)

        val progressBarController = ProgressBarController(this)
        progressBarController.openDialog()

        initScannerView()

        val balance = findViewById<TextView>(R.id.Balance)
        val takeCamera = findViewById<Button>(R.id.TakeCamera)
        val sendDataBee = findViewById<Button>(R.id.sendDataBee)
        codeQRList = findViewById(R.id.listQRCode)

        Timer().schedule(1000) {
            runOnUiThread {
                val localIDR = Locale("in", "ID")
                val numberFormat = NumberFormat.getCurrencyInstance(localIDR)
                val balanceController = BalanceController().execute()
                val response = balanceController.get()
                if (response["Status"].toString() == "0") {
                    val balanceOBJ: String = if (response["Saldo"].toString().isNotEmpty()) {
                        response["Saldo"].toString()
                    } else {
                        "0"
                    }
                    val balanceBonusOBJ: String =
                        if (response["Saldobon"].toString().isNotEmpty()) {
                            response["Saldobon"].toString()
                        } else {
                            "0"
                        }
                    User.balance = balanceOBJ
                    User.balanceBonus = balanceBonusOBJ
                } else {
                    User.balance = "0"
                    User.balanceBonus = "0"
                }

                balance.text =
                    numberFormat.format(if (User.balance.isNotEmpty()) User.balance.toBigInteger() else 0)

                try {
                    val memberController = MemberController().execute()
                    val memberResponse = memberController.get()

                    if (memberResponse.length() != 0) {
                        for (value in 0 until memberResponse.length()) {
                            if (memberResponse.getJSONObject(value)["User"].toString() != "Default") {
                                arrayListUser.add(memberResponse.getJSONObject(value)["User"].toString())
                            }
                        }
                    } else {
                        Toast.makeText(
                            applicationContext,
                            "internet sedang tidak setabil mohon tutup aplikasi dan buka kembali",
                            Toast.LENGTH_LONG
                        ).show()
                        finishAndRemoveTask()
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    Toast.makeText(
                        applicationContext,
                        "internet sedang tidak setabil mohon tutup aplikasi dan buka kembali",
                        Toast.LENGTH_LONG
                    ).show()
                    finishAndRemoveTask()
                }

                if (arrayListUser.size > 0) {
                    val arrayAdapter =
                        ArrayAdapter(
                            applicationContext,
                            android.R.layout.simple_spinner_item,
                            arrayListUser
                        )
                    listUser.adapter = arrayAdapter
                } else {
                    Toast.makeText(
                        applicationContext,
                        "Anda Tidak memiliki member untuk di daftarkan. mohon daftarkan member baru terlebih dahulu",
                        Toast.LENGTH_LONG
                    ).show()
                    finishAndRemoveTask()
                }
                generateText()

                locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
                try {
                    locationManager?.requestLocationUpdates(
                        LocationManager.NETWORK_PROVIDER,
                        0L,
                        0F,
                        locationListener
                    )
                } catch (ex: Exception) {
                    ex.printStackTrace()
                }

                progressBarController.closeDialog()
            }
        }

        validateStup.setOnClickListener {
            if (arrayListQR.size > 0) {
                onPause()
                progressBarController.openDialog()
                for (value in 0 until arrayListQR.size) {
                    if (arrayListQR[value].substring(0, 1) == "-") {
                        Handler().postDelayed({
                            val checkBarcode =
                                ValidateController(arrayListQR[value].substring(1)).execute()
                            val responseCheckBarcode = checkBarcode.get()
                            when {
                                responseCheckBarcode["Status"].toString() == "0" -> {
                                    arrayListQR[value] = responseCheckBarcode["Barcode"].toString()
                                }
                                responseCheckBarcode["Status"].toString() == "2" -> {
                                    arrayListQR.drop(value)
                                    arrayListQRDump.drop(value)
                                }
                                else -> runOnUiThread {
                                    Toast.makeText(
                                        applicationContext,
                                        responseCheckBarcode["Pesan"].toString(),
                                        Toast.LENGTH_LONG
                                    ).show()
                                }
                            }
                            Handler().postDelayed({
                                runOnUiThread {
                                    progressBarController.closeDialog()
                                    generateText()
                                }
                            }, 2000)
                        }, 3000)
                    }
                }
            } else {
                Toast.makeText(this, "Barcode kosong", Toast.LENGTH_SHORT).show()
            }
        }

        takeCamera.setOnClickListener {
            val values = ContentValues()
            values.put(MediaStore.Images.Media.TITLE, "Stup")
            values.put(MediaStore.Images.Media.DESCRIPTION, "Stup")
            imageURI = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
            val callCameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            callCameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageURI)
            startActivityForResult(callCameraIntent, 0)
        }

        sendDataBee.setOnClickListener {
            progressBarController.openDialog()
            var error = 0
            if (longitude.isNotEmpty() && latitude.isNotEmpty()) {
                if (listUser.selectedItem.toString().isNotEmpty()) {
                    val trySendImageBee = uploadImageToServer(filePath)
                    if (trySendImageBee) {
                        for (value in 0 until arrayListQR.size - 1) {
                            val jsonConverter = JSONObject(
                                "{client : '${listUser.selectedItem}', saldo : '$longitude'" +
                                        ", lat : '$latitude', long : '$longitude', image : '$fileName'" +
                                        ", count : '1', code : '${arrayListQR[value]}'}"
                            )
                            println(jsonConverter)
                            val sendBeeController = SendBeeController().execute(jsonConverter)
                            val responseSendBeeController = sendBeeController.get()
                            error += if (responseSendBeeController["Status"].toString() == "1") {
                                1
                            } else {
                                0
                            }
                        }
                        if (error != 0) {
                            Toast.makeText(
                                this,
                                "Barcode yang gagal di kirim = $error",
                                Toast.LENGTH_LONG
                            ).show()
                            val goTo = Intent(this, Home::class.java)
                            progressBarController.closeDialog()
                            startActivity(goTo)
                        } else {
                            Toast.makeText(
                                this,
                                "Seluruh Data sukses terkirim",
                                Toast.LENGTH_LONG
                            ).show()
                            val goTo = Intent(this, Home::class.java)
                            progressBarController.closeDialog()
                            startActivity(goTo)
                        }
                    } else {
                        Toast.makeText(this, "Foto gagal di upload", Toast.LENGTH_LONG).show()
                        progressBarController.closeDialog()
                    }
                } else {
                    Toast.makeText(
                        this,
                        "Client Tidak ada",
                        Toast.LENGTH_LONG
                    ).show()
                    progressBarController.closeDialog()
                }
            } else {
                Toast.makeText(
                    this,
                    "Lokasi anda tidak aktif tolong nyalakan untuk melanjutkan",
                    Toast.LENGTH_LONG
                ).show()
                progressBarController.closeDialog()
            }
        }
    }

    override fun onStart() {
        mScannerView.startCamera()
        super.onStart()
    }

    override fun onPause() {
        mScannerView.stopCamera()
        super.onPause()
    }

    override fun handleResult(p0: Result?) {
        if (p0?.text.toString().isNotEmpty()) {
            val findInArrayList: Boolean = try {
                arrayListQRDump.single { value -> value == p0?.text.toString() }
                false
            } catch (e: Exception) {
                true
            }

            if (findInArrayList) {
                if ((User.balance.toInt() - ((arrayListQR.size) * 250000)) < 0) {
                    Toast.makeText(
                        this,
                        "Saldo anda kurang untuk menambah STUP",
                        Toast.LENGTH_LONG
                    ).show()
                } else {
                    val balance = findViewById<TextView>(R.id.Balance)
                    User.balance = (User.balance.toInt() - 250000).toString()
                    balance.text = User.balance
                    arrayListQR.add("-${p0?.text.toString()}")
                    arrayListQRDump.add(p0?.text.toString())
                    generateText()
                    Handler().postDelayed({
                        runOnUiThread {
                            mScannerView.resumeCameraPreview(this)
                        }
                    }, 1000)
                }
            } else {
                Toast.makeText(this, "Barcode sudah ada", Toast.LENGTH_LONG).show()
                Handler().postDelayed({
                    runOnUiThread {
                        mScannerView.resumeCameraPreview(this)
                    }
                }, 1000)
            }
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

    /**
     * @param requestCode Int
     * @param resultCode Int
     * @param data Intent?
     */
    @SuppressLint("SimpleDateFormat")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        val camera = findViewById<ImageView>(R.id.Camera)
        if (resultCode == Activity.RESULT_OK) {
            try {
                filePath = getRealPathFromImageURI(imageURI)
                val convertArray = filePath.split("/").toTypedArray()
                fileName = convertArray.last()
                val thumbnails = MediaStore.Images.Media.getBitmap(contentResolver, imageURI)
                val bitmap = Bitmap.createScaledBitmap(thumbnails, 150, 150, true)
                camera.setImageBitmap(bitmap)
            } catch (ex: Exception) {
                Toast.makeText(this, "Ada Kesalah saat mengambil gambar", Toast.LENGTH_LONG).show()
            }
        } else {
            Toast.makeText(this, "Anda belum mengisi gambar dokumentasi", Toast.LENGTH_LONG).show()
        }
    }

    /**
     * @param contentUri Uri?
     * @return String
     */
    private fun getRealPathFromImageURI(contentUri: Uri?): String {
        val data: Array<String> = Array(100) { MediaStore.Images.Media.DATA }
        val cursor = managedQuery(contentUri, data, null, null, null)
        val columnIndex = cursor.getColumnIndex(MediaStore.Images.Media.DATA)
        cursor.moveToFirst()
        return cursor.getString(columnIndex)
    }

    /**
     * @param getFile String
     * @return Boolean
     */
    private fun uploadImageToServer(getFile: String): Boolean {
        return try {
            MultipartUploadRequest(this, "http://picotele.com/neomitra/javacoin/klabee.php")
                .addFileToUpload(getFile, "file")
                //.addParameter("parameter", "content parameter")
                .setMaxRetries(2)
                .startUpload()
            true
        } catch (ex: Exception) {
            ex.printStackTrace()
            false
        }
    }

    private fun initScannerView() {
        mScannerView = ZXingScannerView(this)
        mScannerView.setAutoFocus(true)
        mScannerView.setResultHandler(this)
        QR.addView(mScannerView)
    }

    private fun generateText() {
        codeQRList.removeAllViews()

        for (i in 0 until arrayListQR.size) {
            val textView = TextView(this)
            textView.text = arrayListQR[i]
            textView.textAlignment = TextView.TEXT_ALIGNMENT_CENTER
            codeQRList.addView(textView)
        }
    }
}
