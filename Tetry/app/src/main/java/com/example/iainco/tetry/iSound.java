package com.example.iainco.tetry;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.SoundPool;
import android.os.Build;
import android.webkit.JavascriptInterface;

public class iSound {
    private Context ctx;
    private SoundPool sounds = null;
    private int[] soundIDs = new int[2];
    private String[] musicIDs = new String[2];
    private MediaPlayer music;

    iSound(final Context context)
    {
        ctx = context;

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            sounds = new SoundPool.Builder().setMaxStreams(3).setAudioAttributes(new AudioAttributes.Builder().setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build()).build();
        }
        else {
            sounds = new SoundPool(3, AudioManager.STREAM_MUSIC, 0);
        }

         try {
            AssetFileDescriptor afd = ctx.getAssets().openFd("GroundHit.mp3");
            soundIDs[0] = sounds.load(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength(), 0);
            afd.close();
            afd =ctx.getAssets().openFd("ButtonClick.wav");
            soundIDs[1] = sounds.load(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength(), 0);
            afd.close();
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        musicIDs[0] = "Sounds/BackgroundMusic.wav";
        musicIDs[1] = "Sounds/EvilLaugh.wav";

        music = new MediaPlayer();
    }

    @JavascriptInterface
    public void playSound(int id)
    {
        sounds.play(soundIDs[id], 1, 1, 0, 0, 1);
    }

    @JavascriptInterface
    public void playMusic(int id)
    {
        music.reset();
        try {
            AssetFileDescriptor afd = ctx.getAssets().openFd(musicIDs[id]);
            music.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            afd.close();
            if(id == 0) {
                music.setLooping(true);
            }
            else{
                music.setLooping(false);
            }
            music.prepare();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        music.start();
    }
}
