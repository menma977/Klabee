package com.klabee.controller

import android.R
import android.app.Dialog
import androidx.fragment.app.FragmentActivity

@Suppress("NULLABILITY_MISMATCH_BASED_ON_JAVA_ANNOTATIONS")
class ProgressBarFragmentController(fragmentActivity: FragmentActivity) {
    private val dialog = Dialog(fragmentActivity, R.style.Theme_Translucent_NoTitleBar)
    init {
        val view = fragmentActivity.layoutInflater.inflate(com.klabee.R.layout.progressbar, null)
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