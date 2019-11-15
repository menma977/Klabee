package com.klabee.controller

import android.app.Activity
import android.app.Dialog

import com.klabee.R

class ProgressBarController(activity: Activity) {
    private val dialog = Dialog(activity, android.R.style.Theme_Translucent_NoTitleBar)
    init {
        val view = activity.layoutInflater.inflate(R.layout.progressbar, null)
        dialog.setContentView(view)
        dialog.setCancelable(false)
    }

    fun openDialog() {
        dialog.show()
    }

    fun closeDialog() {
        dialog.dismiss()
    }
}
