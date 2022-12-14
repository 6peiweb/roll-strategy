import React, { useEffect, useRef, useState } from 'react';

import { Button, Table, Input } from 'antd';

import './index.css';

import fixed2Dot from '../../utils/fixed2dot';
import getRandomId from '../../utils/get-random-id';
import { BOOM_PERCENT } from '../../constants/boom-percent';

function LongRoll() {
  const [principal, setPrincipal] = useState(1000);
  const [originPrice, setOriginPrice] = useState(30);
  const [originLevel, setOriginLevel] = useState(3);

  const [data, setData] = useState([]);

  const addPrice = useRef(originPrice);

  useEffect(() => {
    setData([
      {
        key: getRandomId(),
        priceWhenAdd: originPrice,
        earn: 0,
        canAddCount: fixed2Dot((principal * originLevel) / originPrice),
        priceBeforeAdd: originPrice,
        boomPriceBeforeAdd: fixed2Dot(originPrice - (originPrice * BOOM_PERCENT / originLevel)),
        boomPercentBeforeAdd: fixed2Dot((originPrice * BOOM_PERCENT / originLevel) / originPrice) * 100 + '%',
        totalCount: fixed2Dot((principal * originLevel) / originPrice),
        totalEarn: 0,
      },
    ]);
  }, [principal, originPrice, originLevel])

  const onAddCount = () => {
    const newPrice = fixed2Dot(addPrice.current);
    const lastItem = data[data.length - 1];
    const newEarn = fixed2Dot((newPrice - lastItem.priceWhenAdd) * lastItem.totalCount);
    const newCanAddCount = fixed2Dot(newEarn * originLevel / newPrice);
    const newPriceBeforeAdd = fixed2Dot((lastItem.totalCount * lastItem.priceBeforeAdd + newPrice * newCanAddCount) / (lastItem.totalCount + newCanAddCount));
    const newBoomPriceBeforeAdd = fixed2Dot(newPriceBeforeAdd - (newPriceBeforeAdd * BOOM_PERCENT / originLevel));
    setData([
      ...data,
      {
        key: getRandomId(),
        priceWhenAdd: newPrice,
        earn: newEarn,
        canAddCount: newCanAddCount,
        priceBeforeAdd: newPriceBeforeAdd,
        boomPriceBeforeAdd: newBoomPriceBeforeAdd,
        boomPercentBeforeAdd: fixed2Dot((newPrice - newBoomPriceBeforeAdd) / newPrice * 100) + '%',
        totalCount: fixed2Dot(newCanAddCount + lastItem.totalCount),
        totalEarn: fixed2Dot(newEarn + lastItem.totalEarn),
      }
    ]);
  }

  const columns = [
    {
      title: '????????????',
      dataIndex: 'index',
      render(_, __, index) {
        return index + 1;
      }
    },
    {
      title: '?????????($)',
      dataIndex: 'priceWhenAdd',
      key: 'priceWhenAdd',
    },
    {
      title: '????????????($)',
      dataIndex: 'earn',
      key: 'earn',
    },
    {
      title: '???????????????',
      dataIndex: 'canAddCount',
      key: 'canAddCount',
    },
    {
      title: '???????????????($)',
      dataIndex: 'priceBeforeAdd',
      key: 'priceBeforeAdd',
    },
    {
      title: '??????????????????($)',
      dataIndex: 'boomPriceBeforeAdd',
      key: 'boomPriceBeforeAdd',
    },
    {
      title: '?????????????????????',
      dataIndex: 'boomPercentBeforeAdd',
      key: 'boomPercentBeforeAdd',
    },
    {
      title: '????????????',
      dataIndex: 'totalCount',
      key: 'totalCount',
    },
    {
      title: '?????????($)',
      dataIndex: 'totalEarn',
      key: 'totalEarn',
    },
  ];

  return (
    <div className="App">
      <div className="origin-input-wrapper">
        <Input className="origin-input-item" type="number" addonBefore="????????????" addonAfter="$" defaultValue={originPrice} onChange={e => setOriginPrice(Number(e.target.value))} />
        <Input className="origin-input-item" type="number" addonBefore="??????" addonAfter="$" defaultValue={principal} onChange={e => setPrincipal(Number(e.target.value))} />
        <Input className="origin-input-item" type="number" addonBefore="????????????" defaultValue={originLevel} onChange={e => setOriginLevel(Number(e.target.value))} />
      </div>
      <div className="action-wrapper">
        <Input className="action-input-item" type="number" addonBefore="??????" addonAfter="$" defaultValue={originPrice} onChange={e => addPrice.current = Number(e.target.value)} />
        <Button type="primary" className="action-input-item" onClick={onAddCount}>??????</Button>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}

export default LongRoll;
