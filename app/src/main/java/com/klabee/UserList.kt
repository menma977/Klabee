package com.klabee

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Gravity
import android.widget.*
import com.klabee.controller.MemberController
import android.widget.TableLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import com.klabee.controller.ListStupController

class UserList : AppCompatActivity() {

    private var switcherTable = false

    @SuppressLint("ResourceAsColor")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_list)

        setDefaultTable()
    }

    @SuppressLint("SetTextI18n")
    private fun setDefaultTable() {
        val tableLayout = findViewById<TableLayout>(R.id.userTable)

        tableLayout.removeAllViews()
        val tableRow0 = TableRow(this)

        val optionRow = TableRow.LayoutParams(
            TableRow.LayoutParams.MATCH_PARENT,
            TableRow.LayoutParams.MATCH_PARENT,
            0f
        )

        optionRow.topMargin = 10
        optionRow.bottomMargin = 20

        tableRow0.layoutParams = optionRow

        val optionHeader = TableRow.LayoutParams(
            TableRow.LayoutParams.WRAP_CONTENT,
            TableRow.LayoutParams.WRAP_CONTENT,
            1.0f
        )

        optionHeader.bottomMargin = 20

        val username = TextView(this)
        username.gravity = Gravity.CENTER
        username.text = "Username"
        username.layoutParams = optionHeader
        tableRow0.addView(username)
        val totalStup = TextView(this)
        totalStup.gravity = Gravity.CENTER
        totalStup.text = "Total Stup"
        totalStup.layoutParams = optionHeader
        tableRow0.addView(totalStup)

        tableLayout.addView(tableRow0)

        val memberController = MemberController().execute()
        val memberResponse = memberController.get()

        println(memberResponse)

        if (memberResponse.length() != 0) {
            for (value in 0 until memberResponse.length()) {
                if (memberResponse.getJSONObject(value)["JmlStup"].toString() != "Default") {
                    val tableRow = TableRow(this)
                    val nameMember = Button(this)
                    val total = TextView(this)

                    val options = TableRow.LayoutParams(
                        TableRow.LayoutParams.WRAP_CONTENT,
                        TableRow.LayoutParams.WRAP_CONTENT,
                        1.0f
                    )

                    options.bottomMargin = 20

                    val backgroundColorValue = ContextCompat.getColor(this, R.color.Primary)
                    val textColorValue = ContextCompat.getColor(this, R.color.textSecondary)
                    nameMember.text = memberResponse.getJSONObject(value)["Nama"].toString()
                    nameMember.gravity = Gravity.CENTER
                    nameMember.setBackgroundColor(backgroundColorValue)
                    nameMember.setTextColor(textColorValue)
                    nameMember.layoutParams = options
                    nameMember.setOnClickListener {
                        onClickButton(memberResponse.getJSONObject(value)["User"].toString())
                    }
                    tableRow.addView(nameMember)

                    total.text = memberResponse.getJSONObject(value)["JmlStup"].toString()
                    total.gravity = Gravity.CENTER
                    total.layoutParams = options
                    tableRow.addView(total)

                    tableLayout.addView(tableRow)
                }
            }
        }

        switcherTable = false
    }

    @SuppressLint("SetTextI18n")
    private fun onClickButton(value : String) {
        val tableLayout = findViewById<TableLayout>(R.id.userTable)
        tableLayout.removeAllViews()
        val tableRow0 = TableRow(this)

        val optionRow = TableRow.LayoutParams(
            TableRow.LayoutParams.MATCH_PARENT,
            TableRow.LayoutParams.MATCH_PARENT,
            0f
        )

        optionRow.topMargin = 10
        optionRow.bottomMargin = 20

        tableRow0.layoutParams = optionRow

        val optionHeader = TableRow.LayoutParams(
            TableRow.LayoutParams.WRAP_CONTENT,
            TableRow.LayoutParams.WRAP_CONTENT,
            1.0f
        )

        optionHeader.bottomMargin = 20

        val barcode = TextView(this)
        barcode.text = "Barcode"
        barcode.layoutParams = optionHeader
        tableRow0.addView(barcode)
        val firstDate = TextView(this)
        firstDate.text = "Tanggal Awal"
        firstDate.layoutParams = optionHeader
        tableRow0.addView(firstDate)
//        val dateOne = TextView(this)
//        dateOne.text = "Bulan 1"
//        dateOne.layoutParams = optionHeader
//        tableRow0.addView(dateOne)
//        val dateTow = TextView(this)
//        dateTow.text = "Bulan 2"
//        dateTow.layoutParams = optionHeader
//        tableRow0.addView(dateTow)
        val dateTree = TextView(this)
        dateTree.text = "Panen"
        dateTree.layoutParams = optionHeader
        tableRow0.addView(dateTree)

        tableLayout.addView(tableRow0)

        val optionItem = TableRow.LayoutParams(
            TableRow.LayoutParams.WRAP_CONTENT,
            TableRow.LayoutParams.WRAP_CONTENT,
            1.0f
        )

        optionItem.bottomMargin = 25
        optionItem.marginEnd = 80

        val listStupController = ListStupController(value).execute()
        val response = listStupController.get()
        if (response.length() != 0) {
            for (values in 0 until response.length()) {
                if (response.getJSONObject(values)["Barcode"].toString() != "Default") {
                    val tableRow = TableRow(this)
                    tableRow.layoutParams = optionRow

                    val barcodeLoop = TextView(this)
                    barcodeLoop.text = response.getJSONObject(values)["Barcode"].toString()
                    barcodeLoop.layoutParams = optionItem
                    tableRow.addView(barcodeLoop)

                    val firstDateLoop = TextView(this)
                    firstDateLoop.text = response.getJSONObject(values)["TglAwal"].toString()
                    firstDateLoop.layoutParams = optionItem
                    tableRow.addView(firstDateLoop)

//                    val dateOneLoop = TextView(this)
//                    dateOneLoop.text = response.getJSONObject(values)["Bln1"].toString()
//                    dateOneLoop.layoutParams = optionItem
//                    tableRow.addView(dateOneLoop)
//
//                    val dateTowLoop = TextView(this)
//                    dateTowLoop.text = response.getJSONObject(values)["Bln2"].toString()
//                    dateTowLoop.layoutParams = optionItem
//                    tableRow.addView(dateTowLoop)

                    val dateTreeLoop = TextView(this)
                    dateTreeLoop.text = response.getJSONObject(values)["Bln3"].toString()
                    dateTreeLoop.layoutParams = optionItem
                    tableRow.addView(dateTreeLoop)

                    tableLayout.addView(tableRow)
                }
            }
        }

        switcherTable = true
    }

    override fun onBackPressed() {
        if (switcherTable) {
            setDefaultTable()
        } else {
            super.onBackPressed()
        }
    }
}
