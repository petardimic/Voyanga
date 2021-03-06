<?php
/**
 * Stores information about bill sent to payonline.
 * Provides some utility functions for easier payonline interactions.
 *
 * The followings are the available columns in table 'bill':
 * @property integer $id
 * @property string $status
 * @property string $transactionId
 * @property string $providerdata
 * @property double $amount
 *
 * The followings are the available model relations:
 * @property HotelBooking[] $hotelBookings
 *
 * @package payments
 * @author  Anatoly Kudinov <kudinov@voyanga.com>
 * @copyright Copyright (c) 2012 EasyTrip LLC
 *
 */
Yii::import("common.extensions.payments.models.Payments_MetaBooker");

class Bill extends CActiveRecord
{
    const STATUS_NEW = 'NEW';
    const STATUS_PREAUTH = 'PRE';
    const STATUS_PAID = 'PAI';
    const STATUS_FAILED = 'FAI';

    protected $channel = 'ecommerce';

    /**
     * Returns the static model of the specified AR class.
     * @param string $className active record class name.
     * @return Bill the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'bill';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('status, amount', 'required'),
            array('id', 'numerical', 'integerOnly'=>true),
            array('amount', 'numerical'),
            array('status', 'length', 'max'=>3),
            array('transactionId', 'length', 'max'=>20),
            array('providerdata', 'safe'),
            // The following rule is used by search().
            // Please remove those attributes that should not be searched.
            array('id, status, transactionId, providerdata, amount', 'safe', 'on'=>'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'hotelBookings' => array(self::HAS_MANY, 'HotelBooking', 'billId'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'status' => 'Status',
            'transactionId' => 'Transaction',
            'providerdata' => 'Providerdata',
            'amount' => 'Amount',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
     */
    public function search()
    {
        // Warning: Please modify the following code to remove attributes that
        // should not be searched.

        $criteria=new CDbCriteria;

        $criteria->compare('id',$this->id);
        $criteria->compare('status',$this->status,true);
        $criteria->compare('transactionId',$this->transactionId,true);
        $criteria->compare('providerdata',$this->providerdata,true);
        $criteria->compare('amount',$this->amount);

        return new CActiveDataProvider($this, array(
            'criteria'=>$criteria,
        ));
    }

    public function setChannel($channel)
    {
        $this->channel = $channel;
    }

    public function getChannelName()
    {
        return $this->channel;
    }


    public function getChannel()
    {
        $parts = explode('_',$this->channel);
        $ucFirstParts = array();
        foreach($parts as $part) {
            $ucFirstParts[] = ucfirst($part);
        }
        $className = 'Payments_Channel_'. implode('_', $ucFirstParts);

        Yii::import("common.extensions.payments.models." . $className);
        $flightBookers = FlightBooker::model()->findAllByAttributes(array('billId'=> $this->id));
        $hotelBookers = HotelBooker::model()->findAllByAttributes(array('billId'=> $this->id));
        $bookers = Yii::app()->payments->preProcessBookers(array_merge($flightBookers, $hotelBookers));
        if(count($bookers)>1)
            throw new Exception("More than 1 processed booker for bill");

        $booker = $bookers[0];

       if(!$booker) {
            # Would never happen in theory
            throw new Exception("No booker for given bill");
        }
        # FIXME passing this is hella retarded
        return new $className($this, $booker);
    }

    public function getChannelVerbose()
    {
        switch ($this->channel) {
            case 'ltr':
                return "Длинная запись";
            case 'gds_galileo':
                return "Галилео";
            case "gds_sabre":
                return "sabre";
            
            default:
                return $this->channel;
        }

    }
}
