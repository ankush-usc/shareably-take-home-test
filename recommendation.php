<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>SBLY Ad Budget</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <link rel="stylesheet" href="./bower_components/bootstrap/dist/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="./bower_components/font-awesome/css/font-awesome.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="./bower_components/Ionicons/css/ionicons.min.css">
    <link rel="stylesheet" href="./bower_components/select2/dist/css/select2.min.css">
    <link rel="stylesheet" href="./bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="./dist/css/AdminLTE.min.css">
    <link rel="stylesheet" href="./bower_components/morris.js/morris.css">

    <link rel="stylesheet" href="./dist/css/skins/skin-blue.min.css">


    <!-- Google Font -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
</head>
<!--
BODY TAG OPTIONS:
=================
Apply one or more of the following classes to get the
desired effect
|---------------------------------------------------------|
| SKINS         | skin-blue                               |
|               | skin-black                              |
|               | skin-purple                             |
|               | skin-yellow                             |
|               | skin-red                                |
|               | skin-green                              |
|---------------------------------------------------------|
|LAYOUT OPTIONS | fixed                                   |
|               | layout-boxed                            |
|               | layout-top-nav                          |
|               | sidebar-collapse                        |
|               | sidebar-mini                            |
|---------------------------------------------------------|
-->

<body class="hold-transition skin-blue sidebar-mini">
    <div class="wrapper">
        <!-- Main Header -->
        <header class="main-header">
            <!-- Logo -->
            <a href="#" class="logo">
                <!-- mini logo for sidebar mini 50x50 pixels -->
                <span class="logo-mini"><b>SBLY</b></span>
                <!-- logo for regular state and mobile devices -->
                <span class="logo-lg"><b>SBLY Ad Budget</b></span>
            </a>
            <!-- Header Navbar -->
            <nav class="navbar navbar-static-top" role="navigation">
                <!-- Sidebar toggle button-->
                <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>

            </nav>
        </header>
        <!-- Left side column. contains the logo and sidebar -->
        <aside class="main-sidebar">
            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar">
                <!-- Sidebar Menu -->
                <ul class="sidebar-menu" data-widget="tree">
                    <!-- Optionally, you can add icons to the links -->
                    <li><a href="index.php"><i class="fa fa-dashboard"></i> <span>HomePage</span></a></li>
                    <li class="active"><a href="#"><i class="fa fa-cubes"></i> <span>Recommendation</span></a></li>
                </ul>
                <!-- /.sidebar-menu -->
            </section>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <section class="content-header">
                <div class="row">
                    <div class="col-md-6">
                        <h3>Recommendation</h3>
                    </div>
                </div>
            </section>

            <!-- Main content -->
            <section class="content container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <!-- general form elements -->
                        <div class="box box-primary">
                            <!-- /.box-header -->
                            <div class="form-group col-md-12">
                                <h3><span id="o_profit">Original Profit: </span>
                                    <span id="p_profit">Predicted Profit: </span></h3>
                            </div>
                        </div>

                        <section class="content container-fluid">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="box">
                                        <div class="box-header">
                                            <h3 class="box-title">New Budget Assignment</h3>
                                        </div>
                                        <div class="box-body" id="divForTable">
                                            <table id="logsTable" class="table table-bordered table-striped" width="100%">
                                                <thead>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                                <tfoot>
                                                </tfoot>
                                            </table>
                                        </div>
                                        <!-- /.box-body -->
                                        <div id="logsTableRefresh" class="overlay">
                                            <i class="fa fa-refresh fa-spin"></i>
                                        </div>
                                    </div>
                                    <!-- /.box -->
                                </div>
                        </section>

                        <section class="content container-fluid">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="box-header">
                                        <h3 class="box-title">Individual Bucket contribution (Top performing to low) to probable profit</h3>
                                    </div>
                                    <div class="box-body chart-responsive">
                                        <div class="chart" id="bar-chart" style=" position: relative;height:450px;width: 100%;overflow-x: scroll;"></div>
                                    </div>
                                    </<div>
                                </div>
                        </section>
                        </div>
                        </div>
                        <!-- /.box -->
                    </div>
                </div>
                <!-- /.row -->
            </section>
            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->

        <!-- Main Footer -->
        <footer class="main-footer">
            <!-- To the right -->
            <div class="pull-right hidden-xs">
            </div>
            <!-- Default to the left -->
            <strong>2019 <a href="#">Ankush</a>.</strong>.
        </footer>
        <!-- /.control-sidebar -->
        <!-- Add the sidebar's background. This div must be placed
  immediately after the control sidebar -->
        <div class="control-sidebar-bg"></div>
    </div>
    <!-- ./wrapper -->

    <!-- REQUIRED JS SCRIPTS -->
    <!-- jQuery 3 -->
    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <!-- Bootstrap 3.3.7 -->
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="bower_components/select2/dist/js/select2.full.min.js"></script>

    <!-- AdminLTE App -->
    <script src="dist/js/adminlte.min.js"></script>
    <script src="bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
    <!-- Slimscroll -->
    <script src="bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
    <script src="./bower_components/raphael/raphael.min.js"></script>
    <script src="./bower_components/morris.js/morris.min.js"></script>
    <script type="text/javascript" src="js/RecommendationEngine.js"></script>

</body>

</html>