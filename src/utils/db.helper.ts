import { SelectQueryBuilder, Like } from 'typeorm'

export const conditionUtils = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
  isLike?: boolean
) => {
  Object.keys(obj).forEach((key) => {
    // if (obj[key]) {
    //   queryBuilder.andWhere(`${key} = :${key}`, { [key]: obj[key] })
    // }
    if (obj[key]) {
      if (isLike) {
        queryBuilder.andWhere(`${key} LIKE :${key}`, { [key]: `%${obj[key]}%` }); // 使用Like操作符进行模糊匹配
      } else {
        queryBuilder.andWhere(`${key} = :${key}`, { [key]: obj[key] });
      }
    }
  })
  return queryBuilder
}
