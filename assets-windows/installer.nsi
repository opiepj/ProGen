!include "MUI2.nsh"

Name "ProGen"
BrandingText "aluxian.com"

# set the icon
!define MUI_ICON "icon.ico"

# define the resulting installer's name:
OutFile "..\dist\ProGenSetup.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\ProGen\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN_TEXT "Start ProGen"
!define MUI_FINISHPAGE_RUN "$INSTDIR\ProGen.exe"

!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

# default section start
Section

  # delete the installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  File /r ..\build\ProGen\win32\*

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall ProGen.exe"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\ProGen.lnk" "$INSTDIR\ProGen.exe"
  CreateShortCut "$SMPROGRAMS\Uninstall ProGen.lnk" "$INSTDIR\Uninstall ProGen.exe"
  CreateShortCut "$DESKTOP\ProGen.lnk" "$INSTDIR\ProGen.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\ProGen.lnk"
  Delete "$SMPROGRAMS\Uninstall ProGen.lnk"
  Delete "$DESKTOP\ProGen.lnk"

SectionEnd
